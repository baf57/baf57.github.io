class Nav extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        let entries = ['.', 'resume', 'projects', 'publications', 'designs', 'wood'];
        let fNames = ['Home', 'Resume', 'Coding Projects', 'Publications', 'Digital Designs',
            'Wood-Working'];
        let icons = ['fa-home', 'fa-suitcase', 'fa-code', 'fa-university', 'fa-paint-brush', 
            'fa-tree'];
        let wStr = `
        <nav id="bar" class="w3-bar-block sideNav lockable" style="top: 0">
            <div id="open" style="display: none">
                <a class="w3-bar-item green navItem" onclick="w3_close()">&#x27f5 Collapse</a>
        `;

        for(let i=0; i < entries.length; i++){
            wStr = wStr.concat('<a href="',entries[i],'/" class="w3-bar-item');
            if(this.getAttribute('page') == entries[i]){
                wStr = wStr.concat(" popping-red ");
            }
            else {
                wStr = wStr.concat(" green ");
            }
            wStr = wStr.concat('navItem">',fNames[i],`</a>
            `);
        }

        wStr = wStr.concat(`<div class="w3-bar-item dark-gray">
                    <div style="line-height: 2; white-space: nowrap;">
                        <a href="https://github.com/baf57"><img id="github" src="global/GitHub-Mark-120px-plus.png"
                            onmouseover="this.src='global/GitHub-Mark-Light-120px-plus.png'"
                            onmouseout="this.src='global/GitHub-Mark-120px-plus.png'"
                            alt="GitHub" style="width: 25px"></a>
                        <a href="https://www.linkedin.com/in/brayden-freitas-a74a971a6"><img id="li" src="global/LI-Dark.png"
                            onmouseover="this.src='global/LI.png'"
                            onmouseout="this.src='global/LI-Dark.png'"
                            alt="GitHub" style="width: 25px"></a>
                        <img src="global/gmail-clear.png" onclick="showEmail(this,true)" 
                            onmouseover="this.src='global/gmail.png'"
                            onmouseout="this.src='global/gmail-clear.png'"
                            alt="Email" style="width:25px; cursor: pointer">
                    </div>
                    <p style="white-space: nowrap;">
                        Brayden Freitas <br>
                        2/2025
                        <a rel="license" href="//creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/80x15.png"></a>
                    </p>
                </div>
            </div>
            <div id="closed">
                <a class="w3-bar-item green navItem" onclick="w3_open()"
                    style="cursor: pointer">&#9776</a>`);

        for(let i=0; i < entries.length; i++){
            wStr = wStr.concat('<a href="',entries[i],'/" class="w3-bar-item');
            if(this.getAttribute('page') == entries[i]){
                wStr = wStr.concat(" popping-red ");
            }
            else {
                wStr = wStr.concat(" green ");
            }
            wStr = wStr.concat('navItem"><i class="fa ',icons[i],`"></i>
            </a>
            `);
        }

        wStr = wStr.concat(`<a class="w3-bar-item dark-gray navItem" onclick="w3_open()">
                    <i class="fa fa-info-circle"></i>
                </a>
            </div>
        </nav>
        `);
        this.innerHTML = wStr;
    }
}

customElements.define('my-nav', Nav);