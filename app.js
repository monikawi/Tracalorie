//------------------- Storage Controller ----------------------
const StorageCtrl = (function() {


  //Public methods
  return {
    storeItem: function(item) {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index) {
        if(updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    removeFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index) {
        if(id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearAllFromStorage: function() {
      localStorage.removeItem('items');
    }
  }
})();



//-------------------- Item Controller ------------------------
const ItemCtrl = (function() {
  //Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }


  //Data Structure / State  DELETE???
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }


  //Public methods
  return {
    getItems: function() {
      return data.items;
    },

    addItem: function(name, calories) {
      //Create ID
      let ID;
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      calories = parseInt(calories);
      // Create new item and add to array
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);
      return newItem;
    },

    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updateItem: function(name, calories) {
      calories = parseInt(calories);

      let found = null;
      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function(id) {
      const ids = data.items.map(function(item) {
        return item.id;
      });

      //Get index
      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },

    clearAllItems: function() {
      data.items = [];
    },

    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    getCurrentItem: function() {
     return data.currentItem;
    },

    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });
      //Set total cal in data structure
      data.totalCalories = total;
      return data.totalCalories;
    },
 
    logData: function() { //testing
      return data;
    }
  }
})();



//--------------------- UI Controller -------------------------
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    editBtn: '.edit-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    nameInput: '#item-name',
    caloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }


  //Public methods
  return {
    populateItemList: function(items) {
      let html = '';
      items.forEach(function(item) {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class=" edit-item fa fa-pencil"></i>
          </a>
        </li>
      `;
      });
      //Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.nameInput).value,
        calories: document.querySelector(UISelectors.caloriesInput).value
      }
    },

    addListItem: function(item) {
      //Show list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //Create li element
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id =  `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems); //node list to arr
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');
        if(itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },

    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(function(item) {
        item.remove();
      });
    },

    clearInput: function() {
      document.querySelector(UISelectors.nameInput).value = '';
      document.querySelector(UISelectors.caloriesInput).value = '';
    },

    addItemToForm: function() {
      document.querySelector(UISelectors.nameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.caloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';

    },

    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    setInitialState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.editBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function() {
      document.querySelector(UISelectors.editBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function() {
      return UISelectors;
    }
  }
})();



//-------------------- App Controller -------------------------
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors(); 
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    //disable submit on enter
    document.addEventListener('keypress', function(e) {
      if(e.keycode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    document.querySelector(UISelectors.editBtn).addEventListener('click', itemUpdateSubmit);
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.setInitialState);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }


  //Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    //Check for name and calorie input
    if(input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      //Add item to UI list and clear fields
      UICtrl.addListItem(newItem);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      //Store in local storage
      StorageCtrl.storeItem(newItem);
      UICtrl.clearInput();
    } else {
      //ADD ALERT ASKING TO FILL IN FIELDS
    }

   

    e.preventDefault();
  }


  //Click edit item
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {
      const listId = e.target.parentNode.parentNode.id; //li element
      //Break into an array
      const listIdArr = listId.split('-');
      //Get item id
      const id = parseInt(listIdArr[1]);
      const itemToEdit = ItemCtrl.getItemById(id);
      //Set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      //Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }


  const itemUpdateSubmit = function(e) {
    //Get item input
    const input = UICtrl.getItemInput();
    //Update
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);    
    UICtrl.updateListItem(updatedItem);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    //Update local storage
    StorageCtrl.updateStorage(updatedItem);
    UICtrl.setInitialState();

    e.preventDefault();
  }


  const itemDeleteSubmit = function(e) {
    //Get current item id
    const currentItem = ItemCtrl.getCurrentItem();
    //Delete from data structure and UI
    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id);

    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    //Remove from local storage
    StorageCtrl.removeFromStorage(currentItem.id);
    UICtrl.setInitialState();

    const items = ItemCtrl.getItems(); 
    if(items.length === 0) {
      UICtrl.hideList();
    }

    e.preventDefault();
  }

  const clearAllItemsClick = function() {
    //Delete all items from data structure
    ItemCtrl.clearAllItems();
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.removeItems();
    //Remove all from storage
    StorageCtrl.clearAllFromStorage();

    UICtrl.hideList();
    UICtrl.setInitialState();
  }


  //Public methods
  return {
    init: function() {
      //Set initial state
      UICtrl.setInitialState();

      const items = ItemCtrl.getItems(); //Fetch items from the data structure
      //Check if any items are there
      if(items.length === 0) {
        UICtrl.hideList();
      } else {
      //Populate list with items
        UICtrl.populateItemList(items);
      }

      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      //Load event listeners
      loadEventListeners();
    }
  }  
})(ItemCtrl, StorageCtrl, UICtrl);




//-------------------- Initialise app -------------------------
App.init();