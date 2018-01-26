//ajaxUrl
var ajaxUrl = "http://61.135.223.13:8089";
//定时器变量
var setTime;
$(document).ready(function() {
    //登录页面
    if ($("#loginBtn").height() != null) {
        //清空浏览器缓存
        window.sessionStorage.clear();
        //防止页面后退
        stopBackFun();
        //登录
        loginFun();
        //按回车触发登录
        enterFun();
    };
    //首页
    if ($("#btnGetBalance").height() != null) {
        //判断浏览器是否有缓存信息 如果有 正常载入页面 如果没有 进入登录页
        if (window.sessionStorage.userAccount == undefined) {
            window.location.href = "login.html";
        } else {
            //默认显示用户名
            $("#userAccount").html(window.sessionStorage.userAccount);
            //显示余额
            $("#userBalance").html(window.sessionStorage.balance / 100 + " 元");
            //点击余额刷新图标动态效果
            var num = 1;
            $("#btnGetBalance").click(function() {
                $("#btnGetBalance i").css({
                    'transition': 'all 0.8s ease-in-out',
                    'transform': 'rotate(' + 180 * num + 'deg)',
                    '-moz-transform': 'rotate(' + 180 * num + 'deg)',
                    '-o-transform': 'rotate(' + 180 * num + 'deg)'
                });
                num++;
                setTimeout(function() {
                    var pages = "index";
                    getBalance(pages);
                }, 800);
            });
            //确认用户是否绑定手机
            if (window.sessionStorage.bindPhone == "false") {

                //如果用户没有绑定手机 则显示绑定手机的模态框
                $('#myModal').modal("show");

                //点击 绑定手机模态框 取消按钮 操作流程
                $("#btnCloseModel").click(function() {
                    loseBindFun();
                });

                //获取短信验证码
                var node = $("#getDuanxinCode");
                var useToDo = "useToBind";
                getCode(node, useToDo);

                //绑定手机模态框确认按钮操作
                bindPhoneFun();
            };
        };
    };
    //充值页面
    if ($("#flowPay").height() != null) {
        //文件导入事件
        upFile();
        //检测手机号码数量和格式
        checkPhoneNum();
        //二级联动
        linkage();
        //阅读文件弹出层
        popupWindow();
        //获取全部产品类别并填入对应的选项
        setProducts();
        //获取验证码
        var node = $("#getrandomcode");
        var useToDo = "useToPay";
        getCode(node, useToDo);
        //充值
        flowPay();
    };
    //订单查询页面
    if ($("#orderQueryBtn").height() != null) {
        //初始化查询日期
        laydate(start);
        laydate(end);
        //订单查询
        $("#orderQueryBtn").click(function() {
            queryOrder();
        });
    };
    //修改绑定手机页面
    if ($(".changebox").height() != null) {
        init_changeBindPhone();
    };
});
//防止页面后退
var stopBackFun = function() {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function() {
        history.pushState(null, null, document.URL);
    });
};
//按回车触发登录
var enterFun = function() {
    $(document).keyup(function(event) {
        if (event.keyCode == 13) {
            $("#loginBtn").trigger("click");
        }
    });
};
//放弃绑定或绑定失败
var loseBindFun = function() {
    //十秒退出倒计时
    var time = 10;
    setTime = setInterval(function() {
        if (time <= 0) {
            clearInterval(setTime);
            window.location.href = "login.html";
            window.sessionStorage.clear();
            return;
        }
        time--;
        $('.layui-layer-content span').html(time);
    }, 1000);
    //打开倒计时弹窗
    layer.open({
        content: $('#quitOut').html(),
        time: 10000, //10s后自动关闭
        closeBtn: 0,
        btn: ['直接退出', '重新绑定'],
        yes: function() {
            clearInterval(setTime);
            window.location.href = "login.html";
            window.sessionStorage.clear();
        },
        cancel: function() {
            clearInterval(setTime);
            $('#myModal').modal("show");
        }
    });
};
//退出
var logoutFun = function() {
    window.location.href = "login.html";
    window.sessionStorage.clear();
};
//导入文件
var upFile = function() {
    $("#upfile").change(function() {

        if (typeof(FileReader) == "undefined") {
            toastr.error("你的浏览器不支持文件读取");
            return;
        }

        var filePath = $("#upfile").val();
        if (filePath.split('.')[1].toLocaleLowerCase() != 'txt') {
            toastr.error("导入文件格式不正确");
            return;
        }

        $("#txtPhoneNum").val("正在导入号码，请稍后……");
        $("#txtPhoneNum").attr("Readonly", true);

        var file = document.getElementById("upfile").files[0];
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function(data) {

            var numphone = this.result.replace(/[\r\n]/g, ";").replace(/;;/g, ";").replace(/;;/g, ";");
            //alert(numphone);
            if (numphone.substring(0, 1) == ";") {
                numphone = numphone.substring(1);
            }
            var reg = /^(1([0-9]{10})[;]{0,1})*$/;
            var re = new RegExp(reg);
            if (!re.test(numphone)) {
                toastr.error("包含格式有误的手机号码或空行，请修正后重新导入。");
                $("#txtPhoneNum").attr("Readonly", false);
                $("#txtPhoneNum").val("");
                return;
            }

            var resNum = numphone.split(';').length;

            if (numphone.split(';')[resNum - 1] == '') {
                resNum = resNum - 1;
            }

            $("#txtNumCount").text("已导入" + resNum + "个号码");

            $("#txtPhoneNum").attr("Readonly", false);
            $("#txtPhoneNum").val(numphone);
        }
        $("#upfile").val("");
    });
};
//检测手机号码数量和格式
var checkPhoneNum = function() {
    $("#txtPhoneNum").change(function() {
        var phoneResult = $("#txtPhoneNum").val();
        var numphone = phoneResult.replace(/[\r\n]/g, ";").replace(/;;/g, ";").replace(/;;/g, ";");
        //alert(numphone);
        if (numphone.substring(0, 1) == ";") {
            numphone = numphone.substring(1);
        }
        var reg = /^(1([0-9]{10})[;]{0,1})*$/;
        var re = new RegExp(reg);
        if (!re.test(numphone)) {
            layer.msg('包含格式有误的手机号码或空行，请修正后重新输入。');
            $("#txtPhoneNum").attr("Readonly", false);
            $("#txtPhoneNum").val("");
            $("#txtNumCount").text("");
            return;
        }

        var resNum = numphone.split(';').length;

        if (numphone.split(';')[resNum - 1] == '') {
            resNum = resNum - 1;
        }

        $("#txtNumCount").text("已导入" + resNum + "个号码");

        $("#txtPhoneNum").attr("Readonly", false);
        $("#txtPhoneNum").val(numphone);
    });
};
//二级联动
var linkage = function() {
    $("#selectYys").change(function() {
        var index = $(this).get(0).selectedIndex;
        $('.llboption').hide().eq(index).show();
    });
};
//阅读协议弹出层
var popupWindow = function() {
    $("#readMe").click(function() {
        layer.open({
            type: 2,
            title: "XX协议",
            skin: 'mybtn-class',
            maxmin: true, //开启最大化最小化按钮
            area: ['893px', '600px'],
            closeBtn: 1,
            content: 'xydocument.html',

            btnAlign: 'c',
            btn: ['同意', '拒绝'],
            yes: function(index) {
                $("#xyCheck").prop("checked", "checked");
                layer.close(index);
            },
            btn2: function(index) {
                $("#xyCheck").removeAttr("checked");;
                layer.close(index);
            }
        });
    });
};
//格式化日期
var format = function(time, format) {
    var t = new Date(time);
    var tf = function(i) { return (i < 10 ? '0' : '') + i };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
};
//生成6位随机字符串
/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 */
function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
};
//数组去重
Array.prototype.unique = function() {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
        if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
        }
    }
    return res;
};
//去除数组中的空值  
function trimSpace(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == "" || typeof(array[i]) == "undefined") {
            array.splice(i, 1);
            i = i - 1;
        }
    }
    return array;
};
//日期范围限制
var start = {
    elem: '#start',
    format: 'YYYY-MM-DD',
    //min: laydate.now(), //设定最小日期为当前日期
    max: '2099-06-16 23:59:59', //最大日期
    istime: true,
    istoday: false,
    choose: function(datas) {
        end.min = datas; //开始日选好后，重置结束日的最小日期
        end.start = datas //将结束日的初始值设定为开始日
    }
};
var end = {
    elem: '#end',
    format: 'YYYY-MM-DD',
    //min: laydate.now(),
    max: '2099-06-16 23:59:59',
    istime: true,
    istoday: false,
    choose: function(datas) {
        start.max = datas; //结束日选好后，重置开始日的最大日期
    }
};
//登录
var loginFun = function() {
    $("#loginBtn").click(function() {
        //验证代理商编号
        var serviceNo;
        if ($("#serviceNo").val() == "" || $("#serviceNo").val().length == "0") {
            parent.layer.tips('请填写代理商编号', '#serviceNo');
            return false;
        } else {
            serviceNo = $("#serviceNo").val();
        };
        //验证获取用户名
        var userName;
        if ($("#userName").val() == "" || $("#userName").val().length == "0") {
            parent.layer.tips('请填写用户名', '#userName');
            return false;
        } else {
            userName = $("#userName").val();
        };
        //验证获取密码
        var passWord;
        if ($("#passWord").val() == "" || $("#passWord").val().length == "0") {
            parent.layer.tips('请填写密码', '#passWord');
            return false;
        } else {
            passWord = $("#passWord").val();
        };
        //MD5加密密码
        var md5PassWord = md5(passWord);
        //将用户名和加密后的密码转换为json字符串
        var loginData = JSON.stringify({
            "userAccount": userName,
            "userPassword": md5PassWord,
            "serviceNo": serviceNo
        });
        //将登录json数据转换为base64字符串
        var ecodeValue = base64encode(utf16to8(loginData));
        //发起登录请求
        $.ajax({
            url: ajaxUrl + '/sas/login/verification?ecode=' + ecodeValue,
            type: 'post',
            dataType: 'text',
            contentType: 'application/text;charset=UTF-8',
            beforeSend: function() {
                $('#loginBtn').attr("disabled", true);
                $('#loginBtn').text("登录中，请稍后");
            },
            success: function(data) {
                var result = utf8to16(base64decode(data.replace(/\s/g, '')));
                result = JSON.parse(result);
                // console.log(result);
                if (result.code == "success") {
                    var userData = JSON.parse(result.date);
                    // 判断用户是否绑定手机 userData[1] == undefined 结果为true 则用户未绑定手机
                    if (userData[0].spMobile == undefined) {
                        window.sessionStorage.userName = userData[0].userName;
                        window.sessionStorage.userAccount = userData[0].userAccount;
                        window.sessionStorage.serviceNo = userData[0].serviceNo;
                        window.sessionStorage.balance = userData[0].balance;
                        window.sessionStorage.spMobile = undefined;
                        window.sessionStorage.bindPhone = false;
                        window.location.href = "index.html";
                    } else {
                        window.sessionStorage.userName = userData[0].userName;
                        window.sessionStorage.userAccount = userData[0].userAccount;
                        window.sessionStorage.serviceNo = userData[0].serviceNo;
                        window.sessionStorage.balance = userData[0].balance;
                        window.sessionStorage.spMobile = userData[0].spMobile;
                        window.location.href = "index.html";
                    };
                } else if (result.code == "false") {
                    layer.alert(result.msg);
                } else {
                    layer.alert("服务器异常，请稍后重新登录");
                }

            },
            complete: function() {
                $('#loginBtn').removeAttr("disabled");
                $('#loginBtn').text("登录");
            },
            error: function(err) {
                layer.alert("服务器异常，请稍后重新登录");
            }
        });
    });
};
//余额查询
var getBalance = function(pages) {
    $.ajax({
        url: ajaxUrl + '/sas/query/getBalance',
        type: 'post',
        dataType: 'text',
        contentType: 'application/text;charset=UTF-8',
        success: function(data) {
            var result = utf8to16(base64decode(data.replace(/\s/g, '')));
            result = JSON.parse(result);
            // console.log(result);
            if (result.code == "200") {
                window.sessionStorage.balance = result.data.leftFee;
                if (pages == "index") {
                    $("#userBalance").html(result.data.leftFee / 100 + " 元");
                } else {
                    var mybalance = window.parent.document.getElementById("userBalance");
                    mybalance.innerHTML = result.data.leftFee / 100 + " 元";
                };
            } else {
                if (pages == "index") {
                    layer.alert("查询余额失败，请稍后重新查询");
                } else {
                    //。。。
                };

            };
        },
        error: function(err) {
            if (pages == "index") {
                layer.alert("查询余额失败，请稍后重新查询");
            } else {
                //。。。
            };
        }
    });
};
//获取短信验证码 node--按钮元素 useToDo--获取短信的用途 如果是useToBind则为绑定电话 如果是useToPay则为支付或者验证默认绑定电话 domType--倒计时显示元素类型
var getCode = function(node, useToDo, domType) {
    node.click(function() {
        if (useToDo == "useToBind") {
            //验证手机号码
            var regMobilezh = /^1(3|4|5|7|8)\d{9}$/;
            var sendPhoneVal;
            if ($("#bindPhoneTxt").val() == "" || $("#bindPhoneTxt").val().length == "0") {
                layer.tips('手机号码不能为空！', '#bindPhoneTxt', {
                    tips: [1, '#78BA32']
                });
                return false;
            };
            if (!regMobilezh.test($("#bindPhoneTxt").val())) {
                layer.tips('手机号码格式错误！', '#bindPhoneTxt', {
                    tips: [1, '#78BA32']
                });
                return false;
            };
            var sendPhoneVal = $("#bindPhoneTxt").val();
        } else {
            if (domType == "aDom") {
                //验证手机号码
                var regMobilezh = /^1(3|4|5|7|8)\d{9}$/;
                var bindPhoneVal;
                if ($("#newPhoneVal").val() == "" || $("#newPhoneVal").val().length == "0") {
                    layer.tips('手机号码不能为空！', '#newPhoneVal', {
                        tips: [1, '#78BA32']
                    });
                    return false;
                };
                if (!regMobilezh.test($("#newPhoneVal").val())) {
                    layer.tips('手机号码格式错误！', '#newPhoneVal', {
                        tips: [1, '#78BA32']
                    });
                    return false;
                };
                if ($("#newPhoneAgain").val() == "" || $("#newPhoneAgain").val().length == "0") {
                    layer.tips('手机号码不能为空！', '#newPhoneAgain', {
                        tips: [1, '#78BA32']
                    });
                    return false;
                };
                if ($("#newPhoneVal").val() != $("#newPhoneAgain").val()) {
                    layer.tips('两次输入的电话号码不一致！', '#newPhoneAgain', {
                        tips: [1, '#78BA32']
                    });
                    return false;
                };
                sendPhoneVal = $("#newPhoneVal").val();
            } else {
                var sendPhoneVal = window.sessionStorage.spMobile;
            };
        };

        //存储参数串
        var data = JSON.stringify({
            'userAccount': window.sessionStorage.userAccount,
            'phone': sendPhoneVal,
            "serviceNo": window.sessionStorage.serviceNo
        });
        //对参数串进行base64加密
        var dataValue = base64encode(utf16to8(data));
        //发起获取验证码请求
        $.ajax({
            url: ajaxUrl + '/sas/phone/sendMessage?ecode=' + dataValue,
            type: 'post',
            dataType: 'text',
            contentType: 'application/text;charset=UTF-8',
            success: function(data) {
                var result = utf8to16(base64decode(data.replace(/\s/g, '')));
                result = JSON.parse(result);
                // console.log(result);
                if (result.msg == "success") {
                    layer.msg("验证码已发送，请注意查收", { icon: 1 });
                    var setTime;
                    var time = 60;
                    setTime = setInterval(function() {
                        if (time <= 0) {
                            clearInterval(setTime);
                            if (domType == "aDom") {
                                node.css("display", "block");
                                $("#randomSec").text("");
                            } else {
                                node.attr("disabled", false);
                                node.val("获取验证码");
                            };
                            return;
                        }
                        time--;
                        if (domType == "aDom") {
                            $("#randomSec").text(time + "s后可重新获取随机密码");
                            node.css("display", "none");
                        } else {
                            node.val(time + "s后重新获取");
                            node.attr("disabled", true);
                        }
                    }, 1000);
                } else {
                    layer.msg("验证码发送失败，请重新获取");
                };
            },
            error: function(err) {
                layer.msg("验证码发送失败，请重新获取");
            }
        });
    });
};
//绑定手机
var bindPhoneFun = function() {
    $("#btnSave").click(function() {
        //验证手机号码
        var regMobilezh = /^1(3|4|5|7|8)\d{9}$/;
        var bindPhoneVal;
        if ($("#bindPhoneTxt").val() == "" || $("#bindPhoneTxt").val().length == "0") {
            layer.tips('手机号码不能为空！', '#bindPhoneTxt', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        if (!regMobilezh.test($("#bindPhoneTxt").val())) {
            layer.tips('手机号码格式错误！', '#bindPhoneTxt', {
                tips: [1, '#78BA32']
            });
            return false;
        };

        bindPhoneVal = $("#bindPhoneTxt").val();

        //验证短信验证码
        var regNumber = /^\d{6}$/;
        var duanxinCodeVal;
        if ($("#duanxinCodeNum").val() == "" || $("#duanxinCodeNum").val().length == "0") {
            layer.tips('短信验证码不能为空！', '#duanxinCodeNum', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        if (!regNumber.test($("#duanxinCodeNum").val())) {
            layer.tips('验证码格式错误！', '#duanxinCodeNum', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        duanxinCodeVal = $("#duanxinCodeNum").val();

        //存储参数串
        var data = JSON.stringify({
            'userAccount': window.sessionStorage.userAccount,
            'code': duanxinCodeVal,
            'phone': bindPhoneVal,
            "serviceNo": window.sessionStorage.serviceNo
        });
        //对参数串进行base64加密
        var dataValue = base64encode(utf16to8(data));
        //发起绑定用户电话请求
        $.ajax({
            url: ajaxUrl + '/sas/phone/bangding?ecode=' + dataValue,
            type: 'post',
            dataType: 'text',
            contentType: 'application/text;charset=UTF-8',
            beforeSend: function() {
                $('#btnSave').attr("disabled", true);
                $('#btnSave').text("绑定中");
            },
            success: function(data) {
                var result = utf8to16(base64decode(data.replace(/\s/g, '')));
                result = JSON.parse(result);
                // console.log(result);
                if (result.msg == "success") {
                    parent.layer.msg('绑定成功', { icon: 1 });
                    window.sessionStorage.spMobile = bindPhoneVal;
                    window.sessionStorage.bindPhone = true;
                    $('#myModal').modal("hide");
                } else {
                    parent.layer.msg('绑定失败', { icon: 2 });
                    //清空短信验证码输入框
                    $("#duanxinCodeNum").val("");
                }
            },
            complete: function() {
                $('#btnSave').removeAttr("disabled");
                $('#btnSave').text("绑定");
            },
            error: function(err) {
                parent.layer.msg('绑定失败');
            }
        });
        //清空短信验证码输入框
        $("#duanxinCodeNum").val("");
    });
};
//获取全部产品类型并写入对应选项
var setProducts = function() {
    var yiDong = [],
        lianTong = [],
        dianXin = [];
    $.ajax({
        url: ajaxUrl + '/sas/query/getAllList',
        type: 'post',
        dataType: 'text',
        contentType: 'application/text;charset=UTF-8',
        success: function(data) {
            // 将返回的内容处理后进行base64解码并格式化为json格式
            var result = utf8to16(base64decode(data.replace(/\s/g, '')));
            result = JSON.parse(result);
            // 打印产品列表返回值
            // console.log(result);
            //成功获取到产品列表 code=200
            if (result.code == "200") {
                // 将运营商按分类整理出对应数组
                var productsLength = result.data.length;
                for (var i = 0; i < productsLength; i++) {
                    if (result.data[i].productName.indexOf("移动") >= 0) {
                        yiDong.push(result.data[i]);
                    } else if (result.data[i].productName.indexOf("联通") >= 0) {
                        lianTong.push(result.data[i]);
                    } else if (result.data[i].productName.indexOf("电信") >= 0) {
                        dianXin.push(result.data[i]);
                    };
                };
                //获取需要填充元素的Dom节点
                var $selectYys = $("#selectYys");
                var $llbProducts = $(".llbproducts");
                //如果移动运营商的数组长度不为0 则将移动填入一级联动选项中 移动下属的流量包套餐填入二级联通选项中
                if (yiDong.length != 0) {
                    $('<option>').html("移动").appendTo($selectYys);
                    var $ydSelectBox = $('<select>').addClass('llboption form-control m-b').appendTo($llbProducts);
                    $('<option>').html("----请选择流量包----").appendTo($ydSelectBox);
                    var yiDongProductsLen = yiDong.length;
                    for (var i = 0; i < yiDongProductsLen; i++) {
                        var price = yiDong[i].price / 100;
                        $('<option>').html(yiDong[i].productName + " " + price + "元").attr("value", yiDong[i].productNo).appendTo($ydSelectBox);
                    };
                };
                //如果联通运营商的数组长度不为0 则将联通填入一级联动选项中 联通下属的流量包套餐填入二级联通选项中
                if (lianTong.length != 0) {
                    $('<option>').html("联通").appendTo($selectYys);
                    var $ltSelectBox = $('<select>').addClass('llboption form-control m-b').appendTo($llbProducts);
                    $('<option>').html("----请选择流量包----").appendTo($ltSelectBox);
                    var lianTongProductsLen = lianTong.length;
                    for (var i = 0; i < lianTongProductsLen; i++) {
                        var price = lianTong[i].price / 100;
                        $('<option>').html(lianTong[i].productName + " " + price + "元").attr("value", lianTong[i].productNo).appendTo($ltSelectBox);
                    };
                };
                //如果电信运营商的数组长度不为0 则将电信填入一级联动选项中 电信下属的流量包套餐填入二级联通选项中
                if (dianXin.length != 0) {
                    $('<option>').html("电信").appendTo($selectYys);
                    var $dxSelectBox = $('<select>').addClass('llboption form-control m-b').appendTo($llbProducts);
                    $('<option>').html("----请选择流量包----").appendTo($dxSelectBox);
                    var dianXinProductsLen = dianXin.length;
                    for (var i = 0; i < dianXinProductsLen; i++) {
                        var price = dianXin[i].price / 100;
                        $('<option>').html(dianXin[i].productName + " " + price + "元").attr("value", dianXin[i].productNo).appendTo($dxSelectBox);
                    };
                };
            } else {
                layer.alert("服务器异常，请稍后手动刷新页面");
            };
        },
        error: function(err) {
            layer.alert("服务器异常，请稍后手动刷新页面");
        }
    });
};
//充值
var flowPay = function() {
    var phoneNum;
    var productNo;
    $("#flowPay").click(function() {
        //验证手机号码区域是否为空

        if ($("#txtPhoneNum").val() == "" || $("#txtPhoneNum").val().length == "0") {
            layer.msg('手机号码不能为空');
            return false;
        } else {
            phoneNum = $("#txtPhoneNum").val();
        };

        //验证用户是否勾选流量包
        var llboptionLen = $(".llboption").length;
        for (var i = 0; i < llboptionLen; i++) {
            $(".llboption").eq(i).css("display");
            if ($(".llboption").eq(i).css("display") == "inline-block") {
                if ($(".llboption").eq(i).val() == "----请选择流量包----") {
                    layer.msg('请选择流量包');
                    return false;
                } else {
                    productNo = $(".llboption").eq(i).val();
                }
            };
        };

        //验证用户是否勾选协议
        if (!$("#xyCheck").is(':checked')) {
            layer.msg('请同意XX协议！');
            return false;
        };

        //充值页面输入选项都没有问题的情况下 打开短信验证模态框
        $('#duanxinModel').modal("show");

        //给短信验证模态框电话赋值
        $(".getcodephone").html(window.sessionStorage.spMobile);


    });

    //点击模态框确认按钮 发起充值请求
    $("#checkDuanxinCode").click(function() {
        //验证短信验证码
        var regNumber = /^\d{6}$/;
        var duanxinCodeVal;
        if ($("#randomcode").val() == "" || $("#randomcode").val().length == "0") {
            layer.tips('短信验证码不能为空！', '#randomcode', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        if (!regNumber.test($("#randomcode").val())) {
            layer.tips('验证码格式错误！', '#randomcode', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        duanxinCodeVal = $("#randomcode").val();
        //声明空数组 用于存放下单结果
        var flowPayResult = [];
        //处理用户提交的充值电话信息 遍历发送请求
        var phoneArr = phoneNum.split(";");
        //数组去重
        var uniquePhoneArr = phoneArr.unique();
        //去重数组中的空字符串
        var trimSpacePhoneArr = trimSpace(uniquePhoneArr);
        var phoneArrLen = trimSpacePhoneArr.length;
        //声明随机串用于识别订单批次 格式为yyyymmddhhmmss+6位数字字母组合随机数
        var nowTime = new Date();
        var orderCode = format(nowTime, "yyyyMMddHHmmss") + '' + randomWord(false, 6);
        $('#checkDuanxinCode').attr("disabled", true);
        for (var i = 0; i < phoneArrLen; i++) {
            var phone = trimSpacePhoneArr[i];
            if (phone.length !== 0) {
                var data = JSON.stringify({
                    'outTradeNo': "",
                    'payCount': phoneArrLen,
                    'OrderCode': orderCode,
                    'phone': phone,
                    'productNo': productNo,
                    'userAccount': window.sessionStorage.userAccount,
                    'codes': duanxinCodeVal,
                    'carrier': window.sessionStorage.spMobile,
                    "serviceNo": window.sessionStorage.serviceNo
                });
                var dataValue = base64encode(utf16to8(data));
                //发起充值请求
                $.ajax({
                    url: ajaxUrl + '/sas/pay/flowPay?ecode=' + dataValue,
                    type: 'post',
                    dataType: 'text',
                    async: false,
                    contentType: 'application/text;charset=UTF-8',
                    success: function(data) {
                        // 将返回的内容处理后进行base64解码并处理成json格式
                        var result = utf8to16(base64decode(data.replace(/\s/g, '')));
                        result = JSON.parse(result);
                        // console.log(result);
                        flowPayResult.push(result.msg);
                    },
                    error: function(err) {
                        layer.msg("下单失败");
                    }
                });
            };
        };
        $('#checkDuanxinCode').removeAttr("disabled");
        //充值后的提示信息
        // console.log(flowPayResult);
        var flowPayResFlag;
        var flowPayResultLen = flowPayResult.length;
        // console.log(flowPayResultLen);
        for (var i = 0; i < flowPayResultLen; i++) {
            var flowPayResVal = flowPayResult[i];
            // console.log(flowPayResVal);
            if (flowPayResVal == "下单成功") {
                flowPayResFlag = true;
                break;
            };
        };
        //如果有一单成功，则提示成功 如果都失败了 就提示失败
        if (flowPayResFlag == true) {
            layer.msg("下单成功，请稍后查询订单详情");
        } else {
            layer.msg("下单失败");
        };

        //清空验证码输入框
        $("#randomcode").val("");
        //查询余额
        var pages = "flowPayPages";
        getBalance(pages);
    });
};
//订单查询
var queryOrder = function() {
    //验证开始时间
    var startTime;
    if ($("#start").val() == "" || $("#start").val().length == "0") {
        layer.tips('开始时间不能为空', '#start', {
            tips: [1, '#78BA32']
        });
        return false;
    } else {
        startTime = $("#start").val();
    };
    //验证结束时间
    var endTime;
    if ($("#end").val() == "" || $("#end").val().length == "0") {
        layer.tips('结束时间不能为空', '#end', {
            tips: [1, '#78BA32']
        });
        return false;
    } else {
        endTime = $("#end").val();
    };
    //验证手机号码
    var regMobilezh = /^1(3|4|5|7|8)\d{9}$/;
    var queryPhoneNum;
    if ($("#txtphone").val() == "" || $("#txtphone").val().length == "0") {
        layer.tips('手机号码不能为空！', '#txtphone', {
            tips: [1, '#78BA32']
        });
        return false;
    };
    if (!regMobilezh.test($("#txtphone").val())) {
        layer.tips('手机号码格式错误！', '#txtphone', {
            tips: [1, '#78BA32']
        });
        return false;

    } else {
        queryPhoneNum = $("#txtphone").val();
    };

    //商户和用户传递参数判断 查询用户时 需要传递log参数 不为空即可
    if (queryPhoneNum == window.sessionStorage.spMobile) {
        var data = JSON.stringify({
            'phone': queryPhoneNum,
            'startTime': startTime,
            'endTime': endTime
        });
    } else {
        var data = JSON.stringify({
            'phone': queryPhoneNum,
            'log': 'userphone',
            'startTime': startTime,
            'endTime': endTime
        });
    };

    var dataValue = base64encode(utf16to8(data));
    $.ajax({
        url: ajaxUrl + '/sas/query/getOrderForDate?ecode=' + dataValue,
        type: 'post',
        dataType: 'text',
        contentType: 'application/text;charset=UTF-8',
        beforeSend: function() {
            $('#orderQueryBtn').attr("disabled", true);
            // $('#orderQueryBtn').text("查询中");
        },
        success: function(data) {
            var result = utf8to16(base64decode(data.replace(/\s/g, '')));
            result = JSON.parse(result);
            // console.log(result);
            //处理结果返回的状态值为对应文字说明
            var queryListsLen = result.length;
            for (var i = 0; i < queryListsLen; i++) {
                var orderState = result[i].callBackState;
                if (orderState == "0") {
                    result[i].callBackState = "成功";
                } else if (orderState == "1") {
                    result[i].callBackState = "失败";
                } else if (orderState == "2") {
                    result[i].callBackState = "未返回";
                } else {
                    result[i].callBackState = "报错";
                };
                result[i].createTime = format(result[i].createTime, "yyyy-MM-dd HH:mm:ss");
            };
            //销毁表格
            $("#queryTable").dataTable().fnDestroy();
            //初始化表格
            $('#queryTable').DataTable({
                "data": result, //数据源
                // "sScrollX": "100%",
                // "sScrollXInner": "110%",
                // "bScrollCollapse": true,
                "bRetrieve": true, //指明当执行dataTable绑定时，是否返回DataTable对象
                "bDestroy": true, //当要在同一个元素上执行新的dataTable绑定时，将之前的那个数据对象清除掉，换以新的对象设置
                "bPaginate": true, //是否分页。
                "bLengthChange": false, //是否允许自定义每页显示条数.
                "iDisplayStart": 0,
                "iDisplayLength": 10, //每页显示10条记录
                "bAutoWidth": true,
                "bProcessing": false, //以指定当正在处理数据的时候，是否显示“正在处理”这个提示信息
                "bFilter": false, //搜索
                "bJQueryUI": true, //页面风格使用jQuery.
                "bSort": false, //是否使用排序,
                "bInfo": true, //显示表格信息
                "aoColumns": [
                    { data: 'prdCode' },
                    { data: 'orderId' },
                    { data: 'phone' },
                    { data: 'createTime' },
                    { data: 'callBackState' }
                ]
            });
            $("#queryTable th").css("width", "20%");
            $("#queryTable td").css("width", "20%");
        },
        complete: function() {
            $('#orderQueryBtn').removeAttr("disabled");
            // $('#orderQueryBtn').text("订单查询");
        },
        error: function(err) {
            layer.msg("查询失败");
        }
    });
};
//初始化修改密码
var init_changeBindPhone = function() {
    //默认显示当前绑定的手机号码
    $("#defaultPhone").html(window.sessionStorage.spMobile);

    //点击获取验证码按钮
    var node = $("#getrandomcode2");
    var useToDo = "useToPay";
    getCode(node, useToDo);

    //验证用户原绑定手机号码
    $("#checkOldPhone").click(function() {
        //验证短信验证码
        var regNumber = /^\d{6}$/;
        var duanxinCodeVal;
        if ($("#duanxinCodeNum1").val() == "" || $("#duanxinCodeNum1").val().length == "0") {
            layer.tips('短信验证码不能为空！', '#duanxinCodeNum1', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        if (!regNumber.test($("#duanxinCodeNum1").val())) {
            layer.tips('验证码格式错误！', '#duanxinCodeNum1', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        duanxinCodeVal = $("#duanxinCodeNum1").val();
        //存储参数串
        var data = JSON.stringify({
            'userAccount': window.sessionStorage.userAccount,
            'code': duanxinCodeVal,
            'phone': window.sessionStorage.spMobile,
            "serviceNo": window.sessionStorage.serviceNo
        });
        //对参数串进行base64加密
        var dataValue = base64encode(utf16to8(data));
        //发起绑定用户电话请求
        $.ajax({
            url: ajaxUrl + '/sas/replacePhone/cheakPhone?ecode=' + dataValue,
            type: 'post',
            dataType: 'text',
            contentType: 'application/text;charset=UTF-8',
            success: function(data) {
                var result = utf8to16(base64decode(data.replace(/\s/g, '')));
                result = JSON.parse(result);
                // console.log(result);
                if (result.msg == "success") {
                    $(".faceside").animate({ "opacity": "0" }, 1000);
                    $(".backside").animate({ "opacity": "1" }, 1000);
                    $(".changebox").css("transform", "rotateY(180deg)");
                    $("#duanxinCodeNum1").val("");
                } else {
                    parent.layer.msg('验证失败', { icon: 2 });
                    $("#duanxinCodeNum1").val("");
                }
            },
            error: function(err) {
                parent.layer.msg('验证失败');
                $("#duanxinCodeNum1").val("");
            }
        });
    });
    //重新绑定手机时 获取验证码
    var node = $("#getrandomcode3");
    var useToDo = "useToPay";
    var domType = "aDom";
    getCode(node, useToDo, domType);
    //点击绑定手机号按钮
    $("#changeToBind").click(function() {
        //验证手机号码
        var regMobilezh = /^1(3|4|5|7|8)\d{9}$/;
        var bindPhoneVal;
        if ($("#newPhoneVal").val() == "" || $("#newPhoneVal").val().length == "0") {
            layer.tips('手机号码不能为空！', '#newPhoneVal', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        if (!regMobilezh.test($("#newPhoneVal").val())) {
            layer.tips('手机号码格式错误！', '#newPhoneVal', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        if ($("#newPhoneAgain").val() == "" || $("#newPhoneAgain").val().length == "0") {
            layer.tips('手机号码不能为空！', '#newPhoneAgain', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        if ($("#newPhoneVal").val() != $("#newPhoneAgain").val()) {
            layer.tips('两次输入的电话号码不一致！', '#newPhoneAgain', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        bindPhoneVal = $("#newPhoneVal").val();
        //验证短信验证码
        var regNumber = /^\d{6}$/;
        var duanxinCodeVal;
        if ($("#duanxinCodeNum2").val() == "" || $("#duanxinCodeNum2").val().length == "0") {
            layer.tips('短信验证码不能为空！', '#duanxinCodeNum2', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        if (!regNumber.test($("#duanxinCodeNum2").val())) {
            layer.tips('验证码格式错误！', '#duanxinCodeNum2', {
                tips: [1, '#78BA32']
            });
            return false;
        };
        duanxinCodeVal = $("#duanxinCodeNum2").val();
        //存储参数串
        var data = JSON.stringify({
            'userAccount': window.sessionStorage.userAccount,
            'code': duanxinCodeVal,
            'phone': bindPhoneVal,
            "serviceNo": window.sessionStorage.serviceNo
        });
        //对参数串进行base64加密
        var dataValue = base64encode(utf16to8(data));
        //发起绑定用户电话请求
        $.ajax({
            url: ajaxUrl + '/sas/phone/bangding?ecode=' + dataValue,
            type: 'post',
            dataType: 'text',
            contentType: 'application/text;charset=UTF-8',
            beforeSend: function() {
                $('#changeToBind').attr("disabled", true);
                $('#changeToBind').text("电话绑定中");
            },
            success: function(data) {
                var result = utf8to16(base64decode(data.replace(/\s/g, '')));
                result = JSON.parse(result);
                // console.log(result);
                if (result.msg == "success") {
                    parent.layer.msg('绑定成功', { icon: 1 });
                    window.sessionStorage.spMobile = bindPhoneVal;
                    $(".backside").animate({ "opacity": "0" }, 1000);
                    $(".faceside").animate({ "opacity": "1" }, 1000);
                    $(".changebox").css("transform", "rotateY(360deg)");
                    clearInputVal();
                } else {
                    parent.layer.msg('绑定失败', { icon: 2 });
                    clearInputVal();
                }
            },
            complete: function() {
                $('#changeToBind').removeAttr("disabled");
                $('#changeToBind').text("绑定手机号");
            },
            error: function(err) {
                parent.layer.msg('绑定失败');
                clearInputVal();
            }
        });
    });
    //点击取消绑定按钮
    $("#delChanged").click(function() {
        $(".backside").animate({ "opacity": "0" }, 1000);
        $(".faceside").animate({ "opacity": "1" }, 1000);
        $(".changebox").css("transform", "rotateY(360deg)");
    });
    //清空短信验证码输入框
    function clearInputVal() {
        $("#newPhoneVal").val("");
        $("#newPhoneAgain").val("");
        $("#duanxinCodeNum2").val("");
    };
};