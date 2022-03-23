class CatCaptchaClass {
    constructor(element) {
        this.element = element;
        this.selected = [
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false],
            [false, false, false, false]
        ];

        this.initialiseElement();
    }

    anySelected() {
        // return true if there are any true's in this.selected array and false otherwise
        return this.selected.some(row => row.some(cell => cell === true));
    }

    initialiseElement() {
        this.element.innerHTML = "";

        const captchaNames = {"skorngy-worngy": "Skorngy Worngy"};
        const captchaFolders = Object.keys(captchaNames);
        const captchaFolder = captchaFolders[Math.floor(Math.random() * captchaFolders.length)];
        const captchaName = captchaNames[captchaFolder];

        const captchaAnswerContainer = CatCaptchaClass.createElement("div", "captcha-answer-container-inner");
        const captchaAnswerContainerOuter = CatCaptchaClass.createElement("div", "captcha-answer-container");

        // split large image into columns and rows
        const header = CatCaptchaClass.createElement("div", "captcha-header", "<h1>Select all squares with a <strong>" + captchaName + "</strong><p class='captcha-lowlight-text'> If there are none, click skip.</p></h1><div class=\"spacer-lol\"></div><img alt='cat' src='assets/images/skorngy-worngy/clue.jpg' />");

        captchaAnswerContainer.append(header);

        const container = CatCaptchaClass.createElement("div", "captcha-columns");

        // create a new image for each column and row
        for (let i = 0; i < 4; i++) {
            let div = CatCaptchaClass.createElement("div", "captcha-column", "");
            for (let j = 0; j < 4; j++) {
                let divA = CatCaptchaClass.createElement("div", "unselected");
                let canvas = document.createElement('img');
                canvas.addEventListener("click", this.onCaptchaItemClick);
                canvas.src = `./assets/images/${captchaFolder}/row-` + (i+1) + "-column-" + (j+1) + ".png";
                canvas.classList.add('captcha-image-' + (i+1) + '-' + (j+1));
                canvas.dataset.coordinates = `${i},${j}`;
                canvas.draggable = false;
                canvas.ondragstart = function(e) { e.preventDefault(); e.stopPropagation(); return false; };
                divA.append(canvas);
                div.append(divA);
            }
            container.append(div);
        }

        captchaAnswerContainer.append(container);

        captchaAnswerContainerOuter.append(captchaAnswerContainer);

        this.element.append(captchaAnswerContainerOuter);
    }

    static createElement(tag, className=null, innerHTML=null) {
        let v = document.createElement(tag);
        if (className) v.className = className;
        if (innerHTML) v.innerHTML = innerHTML;
        return v;
    }

    onCaptchaItemClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let target = e.target;

        while (target && !target.dataset.coordinates) {
            target = target.parentElement;
        }

        if (target && target.dataset.coordinates) {
            const coords = target.dataset.coordinates.split(',');
            const row = parseInt(coords[0]);
            const column = parseInt(coords[1]);

            this.selected[row][column] = !this.selected[row][column];

            if (this.selected[row][column] === true) {
                target.parentElement.classList.add("selected");
            } else {
                target.parentElement.classList.remove("selected");
            }

            if (this.anySelected()) {
                this.element.querySelector(".captcha-lowlight-text").classList.add("some-selected");
            } else {
                this.element.querySelector(".captcha-lowlight-text").classList.remove("some-selected");
            }
        }
    }
}

function initialiseCaptcha(element) {
    return new CatCaptchaClass(element);
}