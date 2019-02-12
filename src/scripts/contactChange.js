import contactCollection from "./contactCollection";
import contactList from "./contactList";


let contactChange = () => {
    //refrence to the entire container list
    let contactDisplayEl = document.getElementById("contactList")
    //adds an event listener to the entire contactList container
    contactDisplayEl.addEventListener("click", () => {
        //if the id of the event target starts with "delete button"
        if (event.target.id.startsWith("deleteButton--")) {
            //create a refrence to the actual id of the contact you want to delte
            let contactId = event.target.id.split("--")[1];
            //calls the method of delete on contactCollection with the ID refrence as an argument
            contactCollection
                .delete(contactId)
                //re-populates the container with updated database information
                .then(contactList);
        } else if (event.target.id.startsWith("editButton--")) {
            //create a refrence to the actual id of the contact you want to edit
            let contactId = event.target.id.split("--")[1]
            // invokes the getContact method and searched for the specific contactId
            contactCollection.getContact(contactId).then(response => {
                //when the contact with the specific ID is returned, reset the input field values, and set the value of the invisible input to the id of the returned contact
                document.getElementById("phone").value = response.phone;
                document.getElementById("email").value = response.email;
                document.getElementById("name").value = response.name;
                document.getElementById("contactId").value = response.id;
            });



        }
    });
};
export default contactChange;