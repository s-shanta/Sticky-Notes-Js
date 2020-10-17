//Class Note
class Note{
    constructor(title,body){
        this.title=title;
        this.body=body;
    }
}
//UI class
class UI{
    static displayNotetoUI(){
        const notes = Store.getNotetoStore();
        notes.forEach((note)=>{
            UI.addNotetoUI(note);
        });
    }

    static addNotetoUI(note){
        var notes = document.querySelector('.tc-notes');
        const newNote = document.createElement('div');
        newNote.className = 'tc-note';
        newNote.innerHTML =    `
        <div class="tc-node-header">
            <span class="tc-note-close">
                <i class="fas fa-times"></i>
            </span>
        </div>
        <div class="tc-note-title" contenteditable="true">
            ${note.title}
        </div>
        <div class="tc-note-body" contenteditable="true">
            ${note.body}
        </div>
        `;
        // note.innerHTML=`<h1>Hello</h1>`;
        notes.appendChild(newNote);
    }
    
    static deleteNotetoUI(e){
        e.parentElement.parentElement.parentElement.remove();
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
        return notes;
    }

    static addNotetoStore(note){
        const notes=Store.getNotetoStore();
        notes.push(note);
        localStorage.setItem('note',JSON.stringify(notes));
    }

    static editNotetoStore(e,text,mainText,editedText){
        const notes=this.getNotetoStore();
        if(e.classList.contains('tc-note-title')){
            notes.forEach((note)=>{
                if(note.title.trim() === mainText && note.body.trim() === text){
                    note.title = editedText.trim();
                    // console.log(`afterinit${note.title}`);
                    window.mainText = note.title;
                    console.log(window.mainText);
                }
            });
            localStorage.setItem('note', JSON.stringify(notes));
        }else{
            notes.forEach((note)=>{
                if(note.body === mainText && note.title === text){
                    note.body = editedText.trim();
                    window.mainText = note.body;
                }
            });
            localStorage.setItem('note', JSON.stringify(notes));
        }
    }

    static deleteNotetoStore(title,body){
        const notes=this.getNotetoStore();
        notes.forEach((note,index)=>{
            if(note.title === title.trim() && note.body === body.trim()){
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
    const note = new Note('title of your note','your note...');
    console.log(note);
    //add note to UI
    UI.addNotetoUI(note);
    //add note to local storage
    Store.addNotetoStore(note);
    //Show sucess message
    UI.showMessage('Note Added !','success');
});

//Event: edit notes
var mainText='';
var editNote = document.querySelector('.tc-notes');
editNote.addEventListener('click',(e)=>{
    if(e.target.classList.contains('tc-note-title') || e.target.classList.contains('tc-note-body')){
        var editedText='';
        window.mainText = e.target.textContent.trim();
        // console.log(`first${window.mainText}`);
        // console.log(`first${editedText}`);
        editNote.addEventListener('keyup',(e)=>{            
            editedText = e.target.textContent;
            if(e.target.classList.contains('tc-note-title')){
                // console.log(`afterkey${window.mainText}`);
                // console.log(`afterkey${editedText.trim()}`);
                Store.editNotetoStore(e.target,e.target.nextElementSibling.textContent.trim(),mainText,editedText);
            }else{
                Store.editNotetoStore(e.target,e.target.previousElementSibling.textContent.trim(),mainText,editedText);
            }
        });
    }
});

//Event: delete notes
var deleteNote = document.querySelector('.tc-notes');
deleteNote.addEventListener('click',(e)=>{
    if(e.target.classList.contains('fa-times')){
        //delete from UI
        UI.deleteNotetoUI(e.target);
        const title = e.target.parentElement.parentElement.nextElementSibling.textContent;
        const body = e.target.parentElement.parentElement.nextElementSibling.nextElementSibling.textContent;
        //delete from Store
        Store.deleteNotetoStore(title,body);
        UI.showMessage('Note deleted !','success');
    }
});