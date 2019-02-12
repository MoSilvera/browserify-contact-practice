//imports function form contact
import contact from "./contact"
//imports contactCollection object from contact collection
import contactCollection from "./contactCollection"



const contactList = () => {
    //invokes the .get method on the imported object, this returns an array of object
    contactCollection.get()
        .then(
            (parsedInfo) => {
                //refrence to the contact list element where the contacts will be printed
                let contactListEl = document.getElementById("contactList")
                //clears the innerHTML of the container -prevents stacking-
                contactListEl.innerHTML = ""
                //loops over the array returned by the fetch
                parsedInfo.forEach((currentObject) => {

                    //passes each object to the contact function -builds the HTML-
                    let contactHTML = contact(currentObject)
                    //injects the created HTML into the DOM
                    contactListEl.innerHTML += contactHTML
                })
            }
        )

}

//exports the contactList function
export default contactList