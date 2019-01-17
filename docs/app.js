"use strict";

// TODO: Implement FETCH for poem
let poem = `Bágt á þjóð í þessum heimi.
Í þessum heimi brjóstin úng
eru líkt og guð þeim gleymi,
gángstígur sem örlög þúng
troða undir stígvél stunda
stígvél járnuð grimd og sorg;
fætur manna, fætur hunda,
fletja brjóstin einsog torg.`;

// Split poem by newline
poem = poem.split("\n");

// Toggle áhersluatkvæði
function toggleAa(e) {
    e.preventDefault();
    e.target.classList.toggle("aa");
}

// Toggle áherslulaust atkvæði
function toggleAl(e) {
    e.preventDefault();
    e.target.classList.toggle("al");
}

// Set up editor when window has loaded
window.onload = function() {
    // Create poem element
    let p = document.createElement("p");
    p.className = "poem";

    // For each line
    for (let i = 0; i < poem.length; i++) {
        let line = document.createElement("span");
        line.className = "line";
        // For each character
        for (let j = 0; j < poem[i].length; j++) {
            // Create span element for each char
            let span = document.createElement("span");
            span.className = "char";
            let textnode = document.createTextNode(poem[i][j]);
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
                            let parent = e.target.parentElement;
                            // If the char selected does not already belong to a group, create one
                            if (!parent.classList.contains("k")) {
                                // Create group for chars
                                let group = document.createElement("span");
                                group.className = "k";

                                let k = 0;
                                // Iterate over all children of the char's parent
                                while (k < parent.children.length) {
                                    let char = parent.children[k];
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
                                let docFrag = document.createDocumentFragment();
                                // For each child
                                while (parent.firstChild) {
                                    // Remove child from parent and add to docFrag
                                    let child = parent.removeChild(parent.firstChild);
                                    docFrag.appendChild(child);
                                }
                                // Replace parent with docFrag
                                parent.parentNode.replaceChild(docFrag, parent);
                            }
                        }
                        // If shift key is not being held, mark áhersluatkvæði
                        else {
                            toggleAa(e);
                        }
                    }
                }
            });
            // Mark áherslulaust atkvæði with secondary mouse button
            span.addEventListener("contextmenu", toggleAl);
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
};
