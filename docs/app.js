"use strict";

const inputSection = document.getElementById("input");

// Read file input as text and initialize poem
function readFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    // When done reading file, call init() and remove file input
    reader.onload = function(evt) {
        init(evt.target.result);
        inputSection.remove();
    };
    reader.readAsText(file);
}

// Read text from textarea and initialize peom
function readFromTextarea(e) {
    const poem = document.getElementById("text-input").value;
    // Do not submit empty poem
    if (poem === "") {
        return;
    }
    init(poem);
    inputSection.remove();
}

// Toggle áhersluatkvæði
function toggleAa(e) {
    // Remove áherslulaust atvæði class if exists
    e.target.classList.remove("al");
    // Add áhersluatkvæði class
    e.target.classList.toggle("aa");
}

// Toggle áherslulaust atkvæði
function toggleAl(e) {
    // Remove áhersluatkvæði class if exists
    e.target.classList.remove("aa");
    // Add áherslulaust atkvæði class
    e.target.classList.toggle("al");
}

// Toggle contraction (úrfelling)
function toggleContraction(e) {
    e.target.classList.toggle("con");
}

// Toggle ljóðstafir
function toggleLs(e) {
    e.target.classList.toggle("ls");
}

// Init function; create poem
function init(poem) {
    // Split poem by newline
    poem = poem.split("\n");
    
    // Create poem element
    const p = document.createElement("p");
    p.className = "poem";

    // For each line
    for (let i = 0; i < poem.length; i++) {
        // Create span element for each line
        const line = document.createElement("span");
        line.className = "line";
        // For each character
        for (let j = 0; j < poem[i].length; j++) {
            // Create span element for each char
            const span = document.createElement("span");
            span.className = "char";
            const textnode = document.createTextNode(poem[i][j]);
            // Mark space chars for presentation purposes
            if (textnode.textContent === " ") {
                span.classList.add("space");
            }
            span.appendChild(textnode);
            /* ======
               Events
               ====== */
            // Primary mouse button: áhersluatkvæði, hákveður/lágkveður
            span.addEventListener("mousedown", function(e) {
                e.preventDefault();
                // Handle only primary mouse button presses
                if (e.button === 0) {
                    // Don't mark áhersluatkvæði if CTRL is being pressed because it will activate context menu (áherslulaust atkvæði)
                    if (!e.ctrlKey) {
                        // Hákveður/lágkveður editing mode if shift key is pressed
                        if (e.shiftKey) {
                            // Get parent element of char
                            const parent = e.target.parentElement;
                            // If the char selected does not already belong to a group, create one
                            if (!parent.classList.contains("k")) {
                                // Create group for chars
                                const group = document.createElement("span");
                                group.className = "k";

                                let k = 0;
                                // Iterate over all children of the char's parent
                                while (k < parent.children.length) {
                                    const char = parent.children[k];
                                    // Skip any groups encountered
                                    if (char.classList.contains("k")) {
                                        k++;
                                    }
                                    // If element encountered is not a group
                                    else {
                                        // Add current char to new group
                                        group.appendChild(char);
                                        // If the char just added is the char that was clicked on, all chars have been added, loop can stop
                                        if (char === e.target) {
                                            break;
                                        }
                                    }
                                }
                                // Insert new group before char k
                                parent.insertBefore(group, parent.children[k]);
                            }
                            // If selected char does belong to a group, delete its group (ungroup it)
                            else {
                                const docFrag = document.createDocumentFragment();
                                // For each child
                                while (parent.firstChild) {
                                    // Remove child from parent and add to docFrag
                                    const child = parent.removeChild(parent.firstChild);
                                    docFrag.appendChild(child);
                                }
                                // Replace parent with docFrag
                                parent.parentNode.replaceChild(docFrag, parent);
                            }
                        }
                        // If alt key is being held, toggle braghvíld
                        else if (e.altKey) {
                            const parent = e.target.parentElement;
                            const nextSibling = e.target.nextSibling;
                            // If a braghvíld already exists after char, remove it
                            if (nextSibling.classList.contains("bh")) {
                                parent.removeChild(nextSibling);
                            }
                            // Else, create one
                            else {
                                const span = document.createElement("span");
                                span.className = "bh";
                                parent.insertBefore(span, nextSibling);
                            }
                        }
                        // If no key is being held, mark áhersluatkvæði
                        else {
                            if (!e.target.classList.contains("space")) {
                                toggleAa(e);
                            }
                        }
                    }
                }
            });
            // Secondary mouse button
            span.addEventListener("contextmenu", function(e) {
                e.preventDefault();
                // If shift is being held, toggle ljóðstafir
                if (e.shiftKey) {
                    toggleLs(e);
                }
                // If alt key is being held, toggle contraction
                else if (e.altKey) {
                    toggleContraction(e);
                }
                // If no key is being held, mark áherslulaust atkvæði
                else {
                    if (!e.target.classList.contains("space")) {
                        toggleAl(e);
                    }
                }
            });
            /* ==========
               End events
               ========== */
            
            // Add char to line
            line.appendChild(span);
        }
        // Add line to poem
        p.appendChild(line);
    }
    // Add poem to body
    document.body.appendChild(p);
}

// On load, initialize file selection
document.getElementById("file-select").addEventListener("change", readFile);
document.getElementById("submit-text").addEventListener("click", readFromTextarea);
