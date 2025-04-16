// Create a container to display shoes
const shoeContainer = document.createElement('div');
shoeContainer.id = 'shoe-list';
// shoeContainer.style.width = '80%';
shoeContainer.style.position = 'absolute';
document.body.appendChild(shoeContainer);

// Create and style the form
const form = document.createElement('form');
form.id = 'add-shoe-form';

let counter = document.createElement('p');
counter.id = 'amount';
counter.textContent = 'The collection has grown to 0 pairs!';
counter.style.textAlign = 'center';

// Form fields
const input = document.createElement('input');
input.id = 'name';
input.placeholder = 'Shoe Name';

const inputCond = document.createElement('input');
inputCond.id = 'cond';
inputCond.placeholder = 'Condition';

// Submit button
const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Add Shoe';
submitButton.style.position = 'sticky';

// Heading
const h1 = document.createElement('h1');
h1.textContent = 'Just Shoe It';

// Message area
const messageH3 = document.createElement('h3');
messageH3.id = 'message';
document.body.appendChild(messageH3);

const deleteMessageH3 = document.createElement('h3');
deleteMessageH3.id = 'message';
document.body.appendChild(deleteMessageH3)

const br = document.createElement('br');

// Append elements to the body
document.body.append(h1, counter, form, messageH3, deleteMessageH3, shoeContainer);
form.append(input, inputCond, submitButton);

// 🟩 Function to update the count of shoes
const updateCount = (numShoes) => {
  if (numShoes === 0) {
    counter.textContent = `Your collection is empty.`;
  } else if (numShoes < 2) {
    counter.textContent = `The collection has grown to ${numShoes} pair!`;
  } else {
    counter.textContent = `The collection has grown to ${numShoes} pairs!`;
  };
};

// 🟩 Function to update the message after adding or deleting a shoe
const updateMessage = (shoe, action = 'add') => {
  if (action === 'add') {
    messageH3.textContent = `Added ${shoe.name} to the collection.`;
    setTimeout(() => {
      messageH3.textContent = '';
    }, 2000)
  } else if (action === 'delete' ) {
     deleteMessageH3.textContent = `${shoe.name} in the trash!`;
     setTimeout(() => {
      deleteMessageH3.textContent = '';
     }, 2000)
  }
};




// 🟩 Function to render all shoes
const renderShoeList = (shoes) => {
  shoeContainer.innerHTML = ''; // Clear previous list

  shoes.forEach(shoe => {
    const shoeDiv = document.createElement('div');
    shoeDiv.style.border = '1px solid black';
    shoeDiv.style.padding = '10px';
    shoeDiv.style.margin = '10px';

    shoeDiv.innerHTML = `
      <p id='sapato'>${shoe.name}</p>
      <p>${shoe.condition}</p>
      <img src="${shoe.photo}" alt="${shoe.name}" style="width: 100%; height: 200px; object-fit: cover;">
      <br>
    `;
    
    const editButton = document.createElement('button');
    editButton.id = 'editbutton';
    editButton.textContent = 'edit';
    editButton.addEventListener('click', () => {
      const newName = prompt("Enter new shoe name:", shoe.name);
      console.log(newName)
      if (newName !== '' && newName !== shoe.name) {
        fetch(`http://localhost:3000/shoes/${shoe.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName})
        })
        .then(res => res.json())
        .then(data => {
          console.log('updated shoe', data)
          fetchAndUpdateCountAndList();
        })
        .catch(err => console.error('Error updating shoe:', err));
      }
    })


    const deleteButton = document.createElement('button');
    deleteButton.id = 'delButton';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteShoe(shoe.id);
    });
    shoeDiv.append(deleteButton, editButton);
    shoeContainer.appendChild(shoeDiv);
  });
};


// 🟩 Fetch shoes and update count + list
const fetchAndUpdateCountAndList = () => {
  fetch('http://localhost:3000/shoes')
    .then(res => res.json())
    .then(data => {
      renderShoeList(data);
      updateCount(data.length);
    
    })
    .catch(err => console.error('Error fetching shoes:', err));
};


// 🟩 Submit new shoe to backend
const submitShoe = (shoeObj) => {
  fetch('http://localhost:3000/shoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shoeObj)
  })
    .then(res => res.json())
    .then(data => {
      fetchAndUpdateCountAndList(); // Refresh list and count
      updateMessage(data, 'add');
    })
    .catch(err => console.error('Error submitting shoe:', err));
};

const deleteShoe = (shoeId) => {
  fetch(`http://localhost:3000/shoes/${shoeId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(shoe => {
    fetchAndUpdateCountAndList();
    updateMessage(shoe, 'delete');
  })
};

// 🟩 Handle form submission
const addShoes = (e) => {
  e.preventDefault();

  const name = input.value.trim();
  const condition = inputCond.value.trim();

  if (!name) return alert("Hey, where's the nickname!");
  if (!condition) return alert("Are these new or worn?");

  const newShoe = {
    name,
    condition,
  };

  submitShoe(newShoe);
  form.reset();
};

// 🟩 Init
form.addEventListener('submit', addShoes);
fetchAndUpdateCountAndList(); // initial load