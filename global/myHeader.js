class Header extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.innerHTML = `
        <header id="header" class="flex-head">
            <div id="pic" class="me-small">
                <a href="./"><img src='global/Irradiated_Square.png' 
                        style='width: 175px; border: 5px solid black'></a>
            </div>
            <div class="flex-vert">
                <a href="./" style="text-decoration:none"><h1 class="name" style="color: #dad9de">Brayden Freitas</h1></a>
                <div>
                    <a href="//github.com/baf57"><img id="github" src="global/GitHub-Mark-120px-plus.png"
                        onmouseover="this.src='global/GitHub-Mark-Light-120px-plus.png'"
                        onmouseout="this.src='global/GitHub-Mark-120px-plus.png'"
                        alt="GitHub" style="width: 25px"></a>
                    <a href="//www.linkedin.com/in/brayden-freitas-a74a971a6"><img id="li" src="global/LI-Dark.png"
                        onmouseover="this.src='global/LI.png'"
                        onmouseout="this.src='global/LI-Dark.png'"
                        alt="GitHub" style="width: 25px"></a>
                    <img src="global/gmail-clear.png" onclick="showEmail(this)" 
                        onmouseover="this.src='global/gmail.png'"
                        onmouseout="this.src='global/gmail-clear.png'"
                        alt="Email" style="width:25px; cursor: pointer">
                </div>
            </div>
            <div class="back-bar popping-red"></div>
        </header>
        `;
    }
}

customElements.define('my-header', Header);