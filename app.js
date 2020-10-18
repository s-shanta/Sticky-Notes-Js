//Class Note
var noteid= 1;
class Note{
    constructor(id,title,body){
        this.id=id;
        this.title=title;
        this.body=body;
    }
}
//UI class
class UI{
    static displayNotetoUI(){
        const notes = Store.getNotetoStore();
        //  console.log(notes);
        notes.forEach((note,index)=>{
            // console.log(note.title);
            UI.addNotetoUI(note);
        });
        if(notes.length >= 1){
            window.noteid = notes[notes.length-1].id +1;
        }
        // console.log(window.noteid);
    }

    static addNotetoUI(note){
        // console.log(note.title);
        var notes = document.querySelector('.tc-notes');
        const newNote = document.createElement('div');
        newNote.className = 'tc-note';
        newNote.innerHTML =    `
        <div class="tc-node-header">
            <p id= 'nid'>${note.id}</p
            <span class="tc-note-close">
                <i class="fas fa-times"></i>
            </span>
        </div>
        <div class="tc-note-title" contenteditable="true">
            <pre id="n-title">${note.title}</pre>
        </div>
        <div class="tc-note-body" contenteditable="true">
            <pre id="n-body">${note.body}</pre>
        </div>
        `;
        // note.innerHTML=`<h1>Hello</h1>`;
        notes.appendChild(newNote);
        // const header = document.getElementById('n-title').innerHTML.replace(/\n/g, '<br>\n');
        // const t = document.createTextNode(note.title);
        // header.appendChild(t);
        // const body = document.getElementById('n-body');
        // const b = document.createTextNode(note.body);
        // body.appendChild(b);
        //  console.log(newNote);
    }
    
    static deleteNotetoUI(e){
        //  console.log(e.parentElement.parentElement);
        e.parentElement.parentElement.remove();
    }

    static showMessage(message,className){
        const container= document.querySelector('.container');
        const notes = document.querySelector('.tc-notes');
        const div = document.createElement('div');
        div.classList.add('alert', `alert-${className}`);
        div.appendChild(document.createTextNode(message));
        container.insertBefore(div, notes);
        //Make it vanish in 3 seconds
        setTimeout(()=>{
            document.querySelector('.alert').remove();
        },2000);

    }
}
//Store class
class Store{
    static getNotetoStore(){
        let notes;
        if(localStorage.getItem('note') === null){
            notes = [];
        }else{
            notes = JSON.parse(localStorage.getItem('note'));
        }
        // console.log(notes);
        return notes;
    }

    static addNotetoStore(note){
        const notes=Store.getNotetoStore();
        notes.push(note);
        localStorage.setItem('note',JSON.stringify(notes));
    }

    static editNotetoStore(e,id,editedText){
        const notes=this.getNotetoStore();
        if(e.classList.contains('tc-note-title')){
            notes.forEach((note)=>{
                if(note.id == id){
                    note.title = editedText;
                }
            });
            localStorage.setItem('note', JSON.stringify(notes));
        }else{
            notes.forEach((note)=>{
                if(note.id == id){
                    note.body = editedText;
                }
            });
            localStorage.setItem('note', JSON.stringify(notes));
        }
    }

    static deleteNotetoStore(id){
        // console.log(id);
        const notes=this.getNotetoStore();
        // console.log(notes);
        // console.log(notes.length);
        notes.forEach((note,index)=>{
            // console.log(`id${note.id}`);
            if(note.id == id){
                // console.log('match');
                notes.splice(index,1);
            }
        });
        localStorage.setItem('note', JSON.stringify(notes));
    }
}
//Event: display notes
document.addEventListener('DOMContentLoaded',UI.displayNotetoUI);

//Event: add notes
var addnote = document.querySelector('#new-button');
addnote.addEventListener('click',(e)=>{
    e.preventDefault();
    //Instantiate note
    const note = new Note(window.noteid++,'title of your note','your note...');
    // console.log(note);
    //add note to UI
    UI.addNotetoUI(note);
    //add note to local storage
    Store.addNotetoStore(note);
    //Show sucess message
    UI.showMessage('Note Added !','success');
});

//Event: edit notes
// var mainText='';
var editNote = document.querySelector('.tc-notes');
editNote.addEventListener('click',(e)=>{
    if(e.target.parentElement.classList.contains('tc-note-title') || e.target.parentElement.classList.contains('tc-note-body')){
        var editedText='';
        // window.mainText = e.target.textContent.trim();
        // console.log(`first${window.mainText}`);
        // console.log(`first${editedText}`);
        editNote.addEventListener('keyup',(e)=>{   
            // editedText = e.target.innerHTML.replace(/\n/g, '\<br>\n');     
            editedText = e.target.innerText;
            // console.log(editedText);
            if(e.target.classList.contains('tc-note-title')){
                // console.log(`afterkey${window.mainText}`);
                // console.log(`afterkey${editedText.trim()}`);
                const id = e.target.parentElement.firstChild.nextElementSibling.textContent;
                console.log(id);
                console.log(editedText);
                Store.editNotetoStore(e.target,id,editedText);
            }else{
                const id = e.target.parentElement.firstChild.nextElementSibling.textContent;
                // console.log(id);
                // console.log(editedText);
                Store.editNotetoStore(e.target,id,editedText);
            }
        });
    }
});

//Event: delete notes
var deleteNote = document.querySelector('.tc-notes');
deleteNote.addEventListener('click',(e)=>{
    if(e.target.classList.contains('fa-times')){
        // console.log(e.target);
        //delete from UI
        UI.deleteNotetoUI(e.target);
        const id = e.target.previousElementSibling.textContent;
        // console.log(id);
        //delete from Store
        Store.deleteNotetoStore(id);
        UI.showMessage('Note deleted !','success');
    }
});