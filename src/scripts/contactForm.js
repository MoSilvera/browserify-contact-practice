//imports the contactCollection object
import contactCollection from "./contactCollection"
//imports the contactList function
import contactList from "./contactList"

const contactForm = () => {
    //adds event listener to the button
    document.getElementById("storeItButton").addEventListener("click", () => {
        //captures the user input values
        const name = document.getElementById("name").value
        const phone = document.getElementById("phone").value
        const email = document.getElementById("email").value
        //creates an object with the user input as key values
        const contactObject = {
            name: name,
            phone: phone,
            email: email
        }

        // Get value of hidden input field
        const id = document.getElementById("contactId").value

        // If it has a non-blank value
        if (id !== "") {
            // Invoke the Put method
            contactCollection.Put(id, contactObject).then(
                () => {
                    //sets the value of the invisible input back to an empty string
                    document.getElementById("contactId").value = ""
                    //invokes the contactList function, printing the updated information
                    contactList()
                }
            )
        } else {
            //invokes the post method on the contactCollection object and passes it the newly created contact object
            contactCollection.Post(contactObject)
            //prints the updated contact list
            .then(contactList)
        }

    })
}
//exports the contactForm function
export default contactForm