(function(window){var svgSprite='<svg><symbol id="icon-liuliangbaochaxunicon" viewBox="0 0 1024 1024"><path d="M943.611112 923.330206c-19.35379 19.35379-50.735521 19.35379-70.089311 0L634.68725 684.496679c-60.087517 49.912783-136.267547 81.131809-220.48667 81.131809-191.602829 0-346.927407-155.324578-346.927407-346.927407S222.597751 71.773673 414.20058 71.773673s346.926384 155.324578 346.926384 346.927407c0 71.546499-21.727861 137.987724-58.839083 193.21863l241.322208 241.322208C962.963878 872.594685 962.963878 903.977439 943.611112 923.330206zM414.20058 170.896228c-136.857994 0-247.804852 110.946858-247.804852 247.804852s110.946858 247.804852 247.804852 247.804852 247.804852-110.946858 247.804852-247.804852S551.057551 170.896228 414.20058 170.896228z"  ></path></symbol><symbol id="icon-liuliangchongzhi" viewBox="0 0 1024 1024"><path d="M749.81376 52.7104H272.82432c-50.98496 0-92.46208 41.78944-92.46208 93.1072v735.7952c0 51.34336 41.47712 93.08672 92.46208 93.08672h476.99456c50.97472 0 92.46208-41.73824 92.46208-93.08672V145.8176c-0.00512-51.31776-41.49248-93.1072-92.4672-93.1072z m-476.98944 50.944h476.99456c23.11168 0 41.90208 18.92864 41.90208 42.16832v559.75936H230.92224V145.8176c0-23.23456 18.80064-42.1632 41.90208-42.1632z m476.98944 820.11648H272.82432c-23.11168 0-41.90208-18.90816-41.90208-42.15296v-125.1072h560.7936v125.1072c0 23.23968-18.7904 42.15296-41.90208 42.15296zM373.79072 495.37024a25.11872 25.11872 0 0 0 13.8752 4.17792 25.2928 25.2928 0 0 0 21.13536-11.47392l50.58048-77.50144 35.80928 74.56768a25.26208 25.26208 0 0 0 22.21056 14.40256c9.15968-0.04608 18.304-5.00736 22.83008-13.44l40.12544-75.30496 35.59936 40.8832a25.16992 25.16992 0 0 0 35.64544 2.37568 25.56928 25.56928 0 0 0 2.3552-35.9424L594.34496 349.5936c-5.44768-6.30272-13.57312-9.35424-21.86752-8.51968a25.30304 25.30304 0 0 0-19.41504 13.27104l-33.93536 63.67232-33.6128-70.04672a25.25696 25.25696 0 0 0-21.10464-14.3104c-9.28256-0.4864-17.80224 3.7376-22.784 11.40736l-75.06944 114.9952c-7.66976 11.76576-4.43392 27.57632 7.23456 35.30752z m86.97856 354.51904c0 28.14464 22.62528 50.95424 50.56 50.95424s50.56-22.8096 50.56-50.95424c0-28.11904-22.62528-50.92352-50.56-50.92352-27.9296 0-50.56 22.80448-50.56 50.92352z" fill="#232232" ></path></symbol></svg>';var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)