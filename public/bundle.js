(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//function returns the html to represent the contact, as well as delete button and edit button, accepts a function as an argument
const contact = contactObject => {
  return `
        <section>
            <h3>${contactObject.name}</h3>
            <div>${contactObject.phone}</div>
            <div>${contactObject.email}</div>
            <button id="deleteButton--${contactObject.id}">Delete ${contactObject.name}</button>
            <button id="editButton--${contactObject.id}">Edit ${contactObject.name}</button>
        </section>`;
}; //exports the contact function


var _default = contact;
exports.default = _default;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _contactCollection = _interopRequireDefault(require("./contactCollection"));

var _contactList = _interopRequireDefault(require("./contactList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let contactChange = () => {
  //refrence to the entire container list
  let contactDisplayEl = document.getElementById("contactList"); //adds an event listener to the entire contactList container

  contactDisplayEl.addEventListener("click", () => {
    //if the id of the event target starts with "delete button"
    if (event.target.id.startsWith("deleteButton--")) {
      //create a refrence to the actual id of the contact you want to delte
      let contactId = event.target.id.split("--")[1]; //calls the method of delete on contactCollection with the ID refrence as an argument

      _contactCollection.default.delete(contactId) //re-populates the container with updated database information
      .then(_contactList.default);
    } else if (event.target.id.startsWith("editButton--")) {
      //create a refrence to the actual id of the contact you want to edit
      let contactId = event.target.id.split("--")[1]; // invokes the getContact method and searched for the specific contactId

      _contactCollection.default.getContact(contactId).then(response => {
        //when the contact with the specific ID is returned, reset the input field values, and set the value of the invisible input to the id of the returned contact
        document.getElementById("phone").value = response.phone;
        document.getElementById("email").value = response.email;
        document.getElementById("name").value = response.name;
        document.getElementById("contactId").value = response.id;
      });
    }
  });
};

var _default = contactChange;
exports.default = _default;

},{"./contactCollection":3,"./contactList":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//creates an object with TWO keys, each is a method
const contactCollection = {
  //deletes a contact from the database
  delete: contactId => {
    return fetch(`http://127.0.0.1:8088/contacts/${contactId}`, {
      method: "DELETE"
    });
  },
  getContact: contactId => {
    return fetch(`http://127.0.0.1:8088/contacts/${contactId}`).then(response => response.json());
  },
  //gets the contact array and parses the json
  get: function () {
    return fetch("http://localhost:8088/contacts").then(response => response.json());
  },
  //edits content in the database- the function accepts an id as well as a contact object arguments
  Put: function (id, contact) {
    return fetch(`http://localhost:8088/contacts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contact)
    });
  },
  //posts to the database - the function accepts an object as the argument
  Post: function (entryToPost) {
    return fetch("http://localhost:8088/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entryToPost)
    });
  } //exports the contactCollection object

};
var _default = contactCollection;
exports.default = _default;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _contactCollection = _interopRequireDefault(require("./contactCollection"));

var _contactList = _interopRequireDefault(require("./contactList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//imports the contactCollection object
//imports the contactList function
const contactForm = () => {
  //adds event listener to the button
  document.getElementById("storeItButton").addEventListener("click", () => {
    //captures the user input values
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value; //creates an object with the user input as key values

    const contactObject = {
      name: name,
      phone: phone,
      email: email // Get value of hidden input field

    };
    const id = document.getElementById("contactId").value; // If it has a non-blank value

    if (id !== "") {
      // Invoke the Put method
      _contactCollection.default.Put(id, contactObject).then(() => {
        //sets the value of the invisible input back to an empty string
        document.getElementById("contactId").value = ""; //invokes the contactList function, printing the updated information

        (0, _contactList.default)();
      });
    } else {
      //invokes the post method on the contactCollection object and passes it the newly created contact object
      _contactCollection.default.Post(contactObject) //prints the updated contact list
      .then(_contactList.default);
    }
  });
}; //exports the contactForm function


var _default = contactForm;
exports.default = _default;

},{"./contactCollection":3,"./contactList":5}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _contact = _interopRequireDefault(require("./contact"));

var _contactCollection = _interopRequireDefault(require("./contactCollection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//imports function form contact
//imports contactCollection object from contact collection
const contactList = () => {
  //invokes the .get method on the imported object, this returns an array of object
  _contactCollection.default.get().then(parsedInfo => {
    //refrence to the contact list element where the contacts will be printed
    let contactListEl = document.getElementById("contactList"); //clears the innerHTML of the container -prevents stacking-

    contactListEl.innerHTML = ""; //loops over the array returned by the fetch

    parsedInfo.forEach(currentObject => {
      //passes each object to the contact function -builds the HTML-
      let contactHTML = (0, _contact.default)(currentObject); //injects the created HTML into the DOM

      contactListEl.innerHTML += contactHTML;
    });
  });
}; //exports the contactList function


var _default = contactList;
exports.default = _default;

},{"./contact":1,"./contactCollection":3}],6:[function(require,module,exports){
"use strict";

var _contactForm = _interopRequireDefault(require("./contactForm"));

var _contactList = _interopRequireDefault(require("./contactList"));

var _contactChange = _interopRequireDefault(require("./contactChange"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//imports functions
//adds event listeners, sets conditions for posting a new contact object or editing selected contact object
(0, _contactForm.default)(); //prints current contact list to the dom

(0, _contactList.default)(); //adds event listener to contacts and sets conditions for deleteing or filling input fields for edit/chaning value of invisible input

(0, _contactChange.default)();

},{"./contactChange":2,"./contactForm":4,"./contactList":5}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2NvbnRhY3QuanMiLCIuLi9zY3JpcHRzL2NvbnRhY3RDaGFuZ2UuanMiLCIuLi9zY3JpcHRzL2NvbnRhY3RDb2xsZWN0aW9uLmpzIiwiLi4vc2NyaXB0cy9jb250YWN0Rm9ybS5qcyIsIi4uL3NjcmlwdHMvY29udGFjdExpc3QuanMiLCIuLi9zY3JpcHRzL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDQUE7QUFDQSxNQUFNLE9BQU8sR0FBSSxhQUFELElBQW1CO0FBQy9CLFNBQVE7O2tCQUVNLGFBQWEsQ0FBQyxJQUFLO21CQUNsQixhQUFhLENBQUMsS0FBTTttQkFDcEIsYUFBYSxDQUFDLEtBQU07d0NBQ0MsYUFBYSxDQUFDLEVBQUcsWUFBVyxhQUFhLENBQUMsSUFBSztzQ0FDakQsYUFBYSxDQUFDLEVBQUcsVUFBUyxhQUFhLENBQUMsSUFBSzttQkFOL0U7QUFRSCxDQVRELEMsQ0FVQTs7O2VBQ2UsTzs7Ozs7Ozs7Ozs7QUNaZjs7QUFDQTs7OztBQUdBLElBQUksYUFBYSxHQUFHLE1BQU07QUFDdEI7QUFDQSxNQUFJLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFULENBQXdCLGFBQXhCLENBQXZCLENBRnNCLENBR3RCOztBQUNBLEVBQUEsZ0JBQWdCLENBQUMsZ0JBQWpCLENBQWtDLE9BQWxDLEVBQTJDLE1BQU07QUFDN0M7QUFDQSxRQUFJLEtBQUssQ0FBQyxNQUFOLENBQWEsRUFBYixDQUFnQixVQUFoQixDQUEyQixnQkFBM0IsQ0FBSixFQUFrRDtBQUM5QztBQUNBLFVBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFOLENBQWEsRUFBYixDQUFnQixLQUFoQixDQUFzQixJQUF0QixFQUE0QixDQUE1QixDQUFoQixDQUY4QyxDQUc5Qzs7QUFDQSxpQ0FDSyxNQURMLENBQ1ksU0FEWixFQUVJO0FBRkosT0FHSyxJQUhMLENB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QUFkLElBQTJCLFdBQTNCO0FBQ0gsS0FORDtBQU9ILEdBZlQ7QUFrQkgsQ0FwQkQsQyxDQXNCQTs7O2VBQ2UsVzs7Ozs7O0FDN0JmOztBQUNBOztBQUNBOzs7O0FBSEE7QUFLQTtBQUNBLDRCLENBQ0E7O0FBQ0EsNEIsQ0FDQTs7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vZnVuY3Rpb24gcmV0dXJucyB0aGUgaHRtbCB0byByZXByZXNlbnQgdGhlIGNvbnRhY3QsIGFzIHdlbGwgYXMgZGVsZXRlIGJ1dHRvbiBhbmQgZWRpdCBidXR0b24sIGFjY2VwdHMgYSBmdW5jdGlvbiBhcyBhbiBhcmd1bWVudFxuY29uc3QgY29udGFjdCA9IChjb250YWN0T2JqZWN0KSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgICAgICAgPHNlY3Rpb24+XG4gICAgICAgICAgICA8aDM+JHtjb250YWN0T2JqZWN0Lm5hbWV9PC9oMz5cbiAgICAgICAgICAgIDxkaXY+JHtjb250YWN0T2JqZWN0LnBob25lfTwvZGl2PlxuICAgICAgICAgICAgPGRpdj4ke2NvbnRhY3RPYmplY3QuZW1haWx9PC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGlkPVwiZGVsZXRlQnV0dG9uLS0ke2NvbnRhY3RPYmplY3QuaWR9XCI+RGVsZXRlICR7Y29udGFjdE9iamVjdC5uYW1lfTwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImVkaXRCdXR0b24tLSR7Y29udGFjdE9iamVjdC5pZH1cIj5FZGl0ICR7Y29udGFjdE9iamVjdC5uYW1lfTwvYnV0dG9uPlxuICAgICAgICA8L3NlY3Rpb24+YFxufVxuLy9leHBvcnRzIHRoZSBjb250YWN0IGZ1bmN0aW9uXG5leHBvcnQgZGVmYXVsdCBjb250YWN0IiwiaW1wb3J0IGNvbnRhY3RDb2xsZWN0aW9uIGZyb20gXCIuL2NvbnRhY3RDb2xsZWN0aW9uXCI7XG5pbXBvcnQgY29udGFjdExpc3QgZnJvbSBcIi4vY29udGFjdExpc3RcIjtcblxuXG5sZXQgY29udGFjdENoYW5nZSA9ICgpID0+IHtcbiAgICAvL3JlZnJlbmNlIHRvIHRoZSBlbnRpcmUgY29udGFpbmVyIGxpc3RcbiAgICBsZXQgY29udGFjdERpc3BsYXlFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFjdExpc3RcIilcbiAgICAvL2FkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGVudGlyZSBjb250YWN0TGlzdCBjb250YWluZXJcbiAgICBjb250YWN0RGlzcGxheUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIC8vaWYgdGhlIGlkIG9mIHRoZSBldmVudCB0YXJnZXQgc3RhcnRzIHdpdGggXCJkZWxldGUgYnV0dG9uXCJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5pZC5zdGFydHNXaXRoKFwiZGVsZXRlQnV0dG9uLS1cIikpIHtcbiAgICAgICAgICAgIC8vY3JlYXRlIGEgcmVmcmVuY2UgdG8gdGhlIGFjdHVhbCBpZCBvZiB0aGUgY29udGFjdCB5b3Ugd2FudCB0byBkZWx0ZVxuICAgICAgICAgICAgbGV0IGNvbnRhY3RJZCA9IGV2ZW50LnRhcmdldC5pZC5zcGxpdChcIi0tXCIpWzFdO1xuICAgICAgICAgICAgLy9jYWxscyB0aGUgbWV0aG9kIG9mIGRlbGV0ZSBvbiBjb250YWN0Q29sbGVjdGlvbiB3aXRoIHRoZSBJRCByZWZyZW5jZSBhcyBhbiBhcmd1bWVudFxuICAgICAgICAgICAgY29udGFjdENvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICAuZGVsZXRlKGNvbnRhY3RJZClcbiAgICAgICAgICAgICAgICAvL3JlLXBvcHVsYXRlcyB0aGUgY29udGFpbmVyIHdpdGggdXBkYXRlZCBkYXRhYmFzZSBpbmZvcm1hdGlvblxuICAgICAgICAgICAgICAgIC50aGVuKGNvbnRhY3RMaXN0KTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQuaWQuc3RhcnRzV2l0aChcImVkaXRCdXR0b24tLVwiKSkge1xuICAgICAgICAgICAgLy9jcmVhdGUgYSByZWZyZW5jZSB0byB0aGUgYWN0dWFsIGlkIG9mIHRoZSBjb250YWN0IHlvdSB3YW50IHRvIGVkaXRcbiAgICAgICAgICAgIGxldCBjb250YWN0SWQgPSBldmVudC50YXJnZXQuaWQuc3BsaXQoXCItLVwiKVsxXVxuICAgICAgICAgICAgLy8gaW52b2tlcyB0aGUgZ2V0Q29udGFjdCBtZXRob2QgYW5kIHNlYXJjaGVkIGZvciB0aGUgc3BlY2lmaWMgY29udGFjdElkXG4gICAgICAgICAgICBjb250YWN0Q29sbGVjdGlvbi5nZXRDb250YWN0KGNvbnRhY3RJZCkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgLy93aGVuIHRoZSBjb250YWN0IHdpdGggdGhlIHNwZWNpZmljIElEIGlzIHJldHVybmVkLCByZXNldCB0aGUgaW5wdXQgZmllbGQgdmFsdWVzLCBhbmQgc2V0IHRoZSB2YWx1ZSBvZiB0aGUgaW52aXNpYmxlIGlucHV0IHRvIHRoZSBpZCBvZiB0aGUgcmV0dXJuZWQgY29udGFjdFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGhvbmVcIikudmFsdWUgPSByZXNwb25zZS5waG9uZTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVtYWlsXCIpLnZhbHVlID0gcmVzcG9uc2UuZW1haWw7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpLnZhbHVlID0gcmVzcG9uc2UubmFtZTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhY3RJZFwiKS52YWx1ZSA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgfSk7XG5cblxuXG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5leHBvcnQgZGVmYXVsdCBjb250YWN0Q2hhbmdlOyIsIi8vY3JlYXRlcyBhbiBvYmplY3Qgd2l0aCBUV08ga2V5cywgZWFjaCBpcyBhIG1ldGhvZFxuY29uc3QgY29udGFjdENvbGxlY3Rpb24gPSB7XG4gICAgLy9kZWxldGVzIGEgY29udGFjdCBmcm9tIHRoZSBkYXRhYmFzZVxuICAgIGRlbGV0ZTogKGNvbnRhY3RJZCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6ODA4OC9jb250YWN0cy8ke2NvbnRhY3RJZH1gLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiXG4gICAgICAgIH0pXG4gIH0sXG4gICAgZ2V0Q29udGFjdDogKGNvbnRhY3RJZCkgPT4ge1xuICAgICAgICByZXR1cm4gZmV0Y2ggKGBodHRwOi8vMTI3LjAuMC4xOjgwODgvY29udGFjdHMvJHtjb250YWN0SWR9YClcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKVxuICAgICAgICAgICAgKVxuICAgIH0sXG5cbiAgICAvL2dldHMgdGhlIGNvbnRhY3QgYXJyYXkgYW5kIHBhcnNlcyB0aGUganNvblxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goXCJodHRwOi8vbG9jYWxob3N0OjgwODgvY29udGFjdHNcIilcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSApXG4gICAgfSxcbiAgICAvL2VkaXRzIGNvbnRlbnQgaW4gdGhlIGRhdGFiYXNlLSB0aGUgZnVuY3Rpb24gYWNjZXB0cyBhbiBpZCBhcyB3ZWxsIGFzIGEgY29udGFjdCBvYmplY3QgYXJndW1lbnRzXG4gICAgUHV0OiBmdW5jdGlvbiAoaWQsIGNvbnRhY3QpIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBodHRwOi8vbG9jYWxob3N0OjgwODgvY29udGFjdHMvJHtpZH1gLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUFVUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShjb250YWN0KVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgLy9wb3N0cyB0byB0aGUgZGF0YWJhc2UgLSB0aGUgZnVuY3Rpb24gYWNjZXB0cyBhbiBvYmplY3QgYXMgdGhlIGFyZ3VtZW50XG4gICAgUG9zdDogZnVuY3Rpb24gKGVudHJ5VG9Qb3N0KSB7XG4gICAgICAgIHJldHVybiBmZXRjaChcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4OC9jb250YWN0c1wiLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZW50cnlUb1Bvc3QpXG4gICAgICAgIH0pXG4gICAgfVxufVxuLy9leHBvcnRzIHRoZSBjb250YWN0Q29sbGVjdGlvbiBvYmplY3RcbmV4cG9ydCBkZWZhdWx0IGNvbnRhY3RDb2xsZWN0aW9uIiwiLy9pbXBvcnRzIHRoZSBjb250YWN0Q29sbGVjdGlvbiBvYmplY3RcbmltcG9ydCBjb250YWN0Q29sbGVjdGlvbiBmcm9tIFwiLi9jb250YWN0Q29sbGVjdGlvblwiXG4vL2ltcG9ydHMgdGhlIGNvbnRhY3RMaXN0IGZ1bmN0aW9uXG5pbXBvcnQgY29udGFjdExpc3QgZnJvbSBcIi4vY29udGFjdExpc3RcIlxuXG5jb25zdCBjb250YWN0Rm9ybSA9ICgpID0+IHtcbiAgICAvL2FkZHMgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGJ1dHRvblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RvcmVJdEJ1dHRvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAvL2NhcHR1cmVzIHRoZSB1c2VyIGlucHV0IHZhbHVlc1xuICAgICAgICBjb25zdCBuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lXCIpLnZhbHVlXG4gICAgICAgIGNvbnN0IHBob25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZVwiKS52YWx1ZVxuICAgICAgICBjb25zdCBlbWFpbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxcIikudmFsdWVcbiAgICAgICAgLy9jcmVhdGVzIGFuIG9iamVjdCB3aXRoIHRoZSB1c2VyIGlucHV0IGFzIGtleSB2YWx1ZXNcbiAgICAgICAgY29uc3QgY29udGFjdE9iamVjdCA9IHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICBwaG9uZTogcGhvbmUsXG4gICAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCB2YWx1ZSBvZiBoaWRkZW4gaW5wdXQgZmllbGRcbiAgICAgICAgY29uc3QgaWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhY3RJZFwiKS52YWx1ZVxuXG4gICAgICAgIC8vIElmIGl0IGhhcyBhIG5vbi1ibGFuayB2YWx1ZVxuICAgICAgICBpZiAoaWQgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIC8vIEludm9rZSB0aGUgUHV0IG1ldGhvZFxuICAgICAgICAgICAgY29udGFjdENvbGxlY3Rpb24uUHV0KGlkLCBjb250YWN0T2JqZWN0KS50aGVuKFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXRzIHRoZSB2YWx1ZSBvZiB0aGUgaW52aXNpYmxlIGlucHV0IGJhY2sgdG8gYW4gZW1wdHkgc3RyaW5nXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFjdElkXCIpLnZhbHVlID0gXCJcIlxuICAgICAgICAgICAgICAgICAgICAvL2ludm9rZXMgdGhlIGNvbnRhY3RMaXN0IGZ1bmN0aW9uLCBwcmludGluZyB0aGUgdXBkYXRlZCBpbmZvcm1hdGlvblxuICAgICAgICAgICAgICAgICAgICBjb250YWN0TGlzdCgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9pbnZva2VzIHRoZSBwb3N0IG1ldGhvZCBvbiB0aGUgY29udGFjdENvbGxlY3Rpb24gb2JqZWN0IGFuZCBwYXNzZXMgaXQgdGhlIG5ld2x5IGNyZWF0ZWQgY29udGFjdCBvYmplY3RcbiAgICAgICAgICAgIGNvbnRhY3RDb2xsZWN0aW9uLlBvc3QoY29udGFjdE9iamVjdClcbiAgICAgICAgICAgIC8vcHJpbnRzIHRoZSB1cGRhdGVkIGNvbnRhY3QgbGlzdFxuICAgICAgICAgICAgLnRoZW4oY29udGFjdExpc3QpXG4gICAgICAgIH1cblxuICAgIH0pXG59XG4vL2V4cG9ydHMgdGhlIGNvbnRhY3RGb3JtIGZ1bmN0aW9uXG5leHBvcnQgZGVmYXVsdCBjb250YWN0Rm9ybSIsIi8vaW1wb3J0cyBmdW5jdGlvbiBmb3JtIGNvbnRhY3RcbmltcG9ydCBjb250YWN0IGZyb20gXCIuL2NvbnRhY3RcIlxuLy9pbXBvcnRzIGNvbnRhY3RDb2xsZWN0aW9uIG9iamVjdCBmcm9tIGNvbnRhY3QgY29sbGVjdGlvblxuaW1wb3J0IGNvbnRhY3RDb2xsZWN0aW9uIGZyb20gXCIuL2NvbnRhY3RDb2xsZWN0aW9uXCJcblxuXG5cbmNvbnN0IGNvbnRhY3RMaXN0ID0gKCkgPT4ge1xuICAgIC8vaW52b2tlcyB0aGUgLmdldCBtZXRob2Qgb24gdGhlIGltcG9ydGVkIG9iamVjdCwgdGhpcyByZXR1cm5zIGFuIGFycmF5IG9mIG9iamVjdFxuICAgIGNvbnRhY3RDb2xsZWN0aW9uLmdldCgpXG4gICAgICAgIC50aGVuKFxuICAgICAgICAgICAgKHBhcnNlZEluZm8pID0+IHtcbiAgICAgICAgICAgICAgICAvL3JlZnJlbmNlIHRvIHRoZSBjb250YWN0IGxpc3QgZWxlbWVudCB3aGVyZSB0aGUgY29udGFjdHMgd2lsbCBiZSBwcmludGVkXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRhY3RMaXN0RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhY3RMaXN0XCIpXG4gICAgICAgICAgICAgICAgLy9jbGVhcnMgdGhlIGlubmVySFRNTCBvZiB0aGUgY29udGFpbmVyIC1wcmV2ZW50cyBzdGFja2luZy1cbiAgICAgICAgICAgICAgICBjb250YWN0TGlzdEVsLmlubmVySFRNTCA9IFwiXCJcbiAgICAgICAgICAgICAgICAvL2xvb3BzIG92ZXIgdGhlIGFycmF5IHJldHVybmVkIGJ5IHRoZSBmZXRjaFxuICAgICAgICAgICAgICAgIHBhcnNlZEluZm8uZm9yRWFjaCgoY3VycmVudE9iamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vcGFzc2VzIGVhY2ggb2JqZWN0IHRvIHRoZSBjb250YWN0IGZ1bmN0aW9uIC1idWlsZHMgdGhlIEhUTUwtXG4gICAgICAgICAgICAgICAgICAgIGxldCBjb250YWN0SFRNTCA9IGNvbnRhY3QoY3VycmVudE9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgLy9pbmplY3RzIHRoZSBjcmVhdGVkIEhUTUwgaW50byB0aGUgRE9NXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhY3RMaXN0RWwuaW5uZXJIVE1MICs9IGNvbnRhY3RIVE1MXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuXG59XG5cbi8vZXhwb3J0cyB0aGUgY29udGFjdExpc3QgZnVuY3Rpb25cbmV4cG9ydCBkZWZhdWx0IGNvbnRhY3RMaXN0IiwiLy9pbXBvcnRzIGZ1bmN0aW9uc1xuaW1wb3J0IGNvbnRhY3RGb3JtIGZyb20gXCIuL2NvbnRhY3RGb3JtXCJcbmltcG9ydCBjb250YWN0TGlzdCBmcm9tIFwiLi9jb250YWN0TGlzdFwiXG5pbXBvcnQgY29udGFjdENoYW5nZSBmcm9tIFwiLi9jb250YWN0Q2hhbmdlXCJcblxuLy9hZGRzIGV2ZW50IGxpc3RlbmVycywgc2V0cyBjb25kaXRpb25zIGZvciBwb3N0aW5nIGEgbmV3IGNvbnRhY3Qgb2JqZWN0IG9yIGVkaXRpbmcgc2VsZWN0ZWQgY29udGFjdCBvYmplY3RcbmNvbnRhY3RGb3JtKClcbi8vcHJpbnRzIGN1cnJlbnQgY29udGFjdCBsaXN0IHRvIHRoZSBkb21cbmNvbnRhY3RMaXN0KClcbi8vYWRkcyBldmVudCBsaXN0ZW5lciB0byBjb250YWN0cyBhbmQgc2V0cyBjb25kaXRpb25zIGZvciBkZWxldGVpbmcgb3IgZmlsbGluZyBpbnB1dCBmaWVsZHMgZm9yIGVkaXQvY2hhbmluZyB2YWx1ZSBvZiBpbnZpc2libGUgaW5wdXRcbmNvbnRhY3RDaGFuZ2UoKSJdfQ==
