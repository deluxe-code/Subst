class ScheduleItem {
    drugTitle;
    scheduledTime;
    taken;
    timeTook;
    element;
    constructor(drugTitle, scheduledTime) {
        this.drugTitle = drugTitle;
        this.scheduledTime = scheduledTime;
        this.createElement();
    }

    createElement() {
        let mainContainer = document.createElement("div");
        let drugTitle = document.createElement("h1");
        let scheduledTime = document.createElement("h2");
        drugTitle.innerHTML = this.drugTitle;
        scheduledTime.innerHTML = this.scheduledTime;
        mainContainer.appendChild(drugTitle);
        mainContainer.appendChild(scheduledTime);
        mainContainer.className = "dose";
        this.element = mainContainer;
        return mainContainer;
    }
}
var scheduledItems = [];
var swiped = false;
const swipeTriggerDistance = 150;
scheduledItems[0] = new ScheduleItem("Kratom", "8:30PM");
scheduledItems[1] = new ScheduleItem("Krokodile", "8:30PM");
for (var i = 2; i < 15; i++) {
    scheduledItems[i] = new ScheduleItem("Krokodile", "8:30PM");
}
window.addEventListener('load', (event) => { startUp() });
function startUp() {
    dragList(0, 0);// * This is to set the position to the default position.
    // * For some reason the positioning doesn't work correctly when initialized, even though it looks like it is.
    // * Using this statement as part of initialization fixes the issue.
    let touchOrigin;
    let fingerPos;
    let fingerPosY;
    loadScheduledItems();
    document.getElementById("bottomSection").style.touchAction = "none";
    function touchStart(e) {
        fingerPos = e.targetTouches[0];
        fingerPosY = fingerPos.clientY;
        touchOrigin = fingerPosY + document.getElementById("mainSection").scrollTop;
        document.getElementById("bottomSection").style.transition = "transform 0s";
    }
    function touchMove(e) {
        fingerPos = e.targetTouches[0];
        fingerPosY = fingerPos.clientY;
        if (!swiped) {
            dragList(fingerPosY, touchOrigin);
        } else if (document.getElementById("mainSection").scrollTop == 0 && (fingerPosY > touchOrigin)) {

            dragList(fingerPosY - document.getElementById("topSection").offsetHeight, touchOrigin);
            document.getElementById("mainSection").style.overflow = "hidden";
            document.getElementById("bottomSection").style.overflow = "hidden";
            document.getElementById("bottomSection").style.touchAction = "none";
            //Find more efficient way to do this^
        }
    }
    function touchEnd(e) {
        if (!swiped) {
            if ((fingerPosY - touchOrigin) < -swipeTriggerDistance) {
                document.getElementById("bottomSection").style.transition = "transform 0.6s";
                dragList(-document.getElementById("topSection").offsetHeight, 0);
                document.getElementById("mainSection").style.overflow = "scroll";
                document.getElementById("bottomSection").style.overflow = "scroll";
                document.getElementById("bottomSection").style.touchAction = "auto";
                swiped = true;
            } else {
                document.getElementById("bottomSection").style.transition = "transform 0.6s";
                dragList(0, 0);
            }
        } else {
            if (document.getElementById("mainSection").scrollTop == 0 && (fingerPosY - touchOrigin) > swipeTriggerDistance) {
                document.getElementById("bottomSection").style.transition = "transform 0.6s";
                document.getElementById("bottomSection").style.transition = "transform 0.6s";
                document.getElementById("mainSection").style.overflow = "hidden";
                document.getElementById("bottomSection").style.overflow = "hidden";
                document.getElementById("bottomSection").style.touchAction = "none";
                swiped = false;
                dragList(0, 0);
            }
        }
    }
    //unable to properly detect overscroll because scrollTop doesn't go past 0. 0 is the default state, so things conflict. I need to find either a better way of detecting overscroll or something else.
    document.getElementById("bottomSection").addEventListener("touchend", touchEnd, { passive: true });
    document.getElementById("bottomSection").addEventListener("touchstart", touchStart, { passive: true });
    document.getElementById("bottomSection").addEventListener("touchmove", touchMove, { passive: true });
}
function loadScheduledItems() {
    this.scheduledItems.forEach(element => {
        document.getElementById("bottomSection").appendChild(element.element);
    });
    document.getElementById("bottomSection").appendChild
}
function dragList(fingerPos, touchOrigin) {
    relativeFingerPos = fingerPos - document.getElementById("topSection").offsetHeight;
    fingerPosWithRespectToLocalPos = relativeFingerPos - (touchOrigin - document.getElementById("topSection").offsetHeight);
    document.getElementById("bottomSection").style.transform = "translate(0px, " + (fingerPosWithRespectToLocalPos) + "px)";
    console.log(fingerPosWithRespectToLocalPos);
}