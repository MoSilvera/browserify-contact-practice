//imports functions
import contactForm from "./contactForm"
import contactList from "./contactList"
import contactChange from "./contactChange"

//adds event listeners, sets conditions for posting a new contact object or editing selected contact object
contactForm()
//prints current contact list to the dom
contactList()
//adds event listener to contacts and sets conditions for deleteing or filling input fields for edit/chaning value of invisible input
contactChange()