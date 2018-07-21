/**********************************

*  Wobbly Text Effect    
*  by http://www.mf2fm.com/rv

**********************************/
const speed = 150; // speed of wobbling, lower is faster
const wobbleheight = 3; // height of wobbling in pixels
const alink = ""; // page to link text to (set to ="" for no link)
let wobtxt;
let wobcnt = 0;
let i;
let wobli;
let wobble = document.createElement('div')
wobble.setAttribute('id', 'wobble')
wobble.setAttribute('class', 'btn italic')
wobble.innerText = 'Cat Bounce!'
document.body.appendChild(wobble)
wobtxt = wobble.firstChild.nodeValue;
while (wobble.childNodes.length) wobble.removeChild(wobble.childNodes[0]);
for (i = 0; i < wobtxt.length; i++) {
  wobli = document.createElement("span");
  wobli.setAttribute("id", `wobb${i}`);
  wobli.style.position = "relative";
  wobli.appendChild(document.createTextNode(wobtxt.charAt(i)));
  if (alink) {
    wobli.style.cursor = "pointer";
    wobli.onclick = () => { top.location.href = alink; }
  }
  wobble.appendChild(wobli);
}
setInterval(function () {
  for (let i = 0; i < wobtxt.length; i++) document.getElementById(`wobb${i}`).style.top = `${Math.round(wobbleheight * Math.sin(i + wobcnt))}px`
  wobcnt++;
}, speed);