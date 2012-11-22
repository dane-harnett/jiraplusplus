/**
  * JIRAPLUSPLUS Options Page
  * @author Scott Warren
  * Implements functionality for edit/delete/add
  * of Favourites utilizing localStorage
  */

JIRAPLUSPLUS_OPTIONS = {

	init:function() {
		this.binds(); // all jQuery click/hover/etc binds
		this.displayExistingFavourites(); // display table of Favourites
	},
	binds:function() {
		var self = this;
		$('#newFavourite').submit(function(e) { // on add new favourite form submit
			e.preventDefault(); // prevent form from submitting
			var $form = $(this); // cache current form selector

			if ( self.validation( $form ) === true ) { // if validation passes
				$form.find('.validationMessage').fadeOut(); // validation has passed, hide any validation errors that were there
				self.addNewFavourite( $form ); // add new favourite to localStorage
			}
			else {
				// add a message do the validation container
				$form.find('.validationMessage').html("Please make sure you have entered fields for your new Favourite!");
				// and fade it in
				$form.find('.validationMessage').fadeIn();
			}
		});
		/*$('.editFavourite').live('click', function(e, y) {
			e.preventDefault();
			self.editFavourite(this);
		});*/
		$('.deleteFavourite').live('click', function(e) {
			e.preventDefault();
			self.deleteFavourite($(this));
		});
	},
	validation:function($form) {
		// @TODO validate if there is an existing Favourite for the new addition
		var passed = false;
		$form.find('input').each(function() { // for each input inside our submitted form
			var $input = $(this); // cache selector in local scoped variable

			if ( $input.val() === "") { // if input value is empty
				passed = false; // validation failed
				return false; // stop iterating over values, our validation failed
			}
			else {
				passed = true; // validation has passed so far :)
			}
		});
		return passed;
	},
	addNewFavourite:function($form) {
		var self = this;
		this.newFavouriteData = {}; // object to be used to hold data for new Favourite
		$form.find('input').each(function() {
			$input = $(this); // cache selector
			// making object from ID of input (eg: self.newFavouriteData.email = "example@email.com")
			self.newFavouriteData[$input.attr('id')] = $input.val();
		});

		// checking if JIRAPlusPlus options exist otherwise make a new object
		if ( localStorage.getItem('jiraplusplus_options') === null ) {
			localStorage.jiraplusplus_options = "{}";
		}
		// create local scoped var to deal with input data in JSON format rather than a string
		var currentOptions = JSON.parse(localStorage.jiraplusplus_options);

		if ( typeof currentOptions.customAssignees === "undefined" ) {
			currentOptions.customAssignees = [];
		}

		currentOptions.customAssignees.push(self.newFavouriteData);

		localStorage.setItem('jiraplusplus_options', JSON.stringify(currentOptions));

		chrome.storage.sync.set(currentOptions);


		// add successful message @TODO fadeout message after a certain time
		$('.validationSuccessMessage').html("Success! You have added "+self.newFavouriteData.name+" to your Favourites list!").fadeIn();
		
		// empty inputs so user can enter again
		$form.find('input').each(function() {
			$(this).val('');
		});

		// refresh the edit/delete list
		this.displayExistingFavourites();
	},

	displayExistingFavourites: function() {
		// do we have any JIRAPlusPlus options?
		if ( localStorage.getItem('jiraplusplus_options') !== null ) {
			// JSON.parse localstorage and then put into local var so we can do normal checks on them
			var currentFavourites = JSON.parse(localStorage.getItem('jiraplusplus_options'));
			// check if we have any existing options and dispaly them
			if ( typeof currentFavourites.customAssignees !== "undefined" ) {
				$.each(currentFavourites.customAssignees, function(count, data) {
					// add new row with new Favourite
					// $('.existingFavouritesData table tbody').append('<tr><td class="name">'+data.name+'</td><td class="email">'+data.email+'</td><td><a href="#" class="deleteFavourite pull-right label label-important">Delete</a>&nbsp;<a href="#" class="editFavourite pull-right label label-info">Edit</a></td></tr>');
					// commented out above line so when we implement the Edit button functionality we just have to uncomment out the line
					$('.existingFavouritesData table tbody').append('<tr><td class="name">'+data.name+'</td><td class="email">'+data.email+'</td><td><a href="#" class="deleteFavourite pull-right label label-important">Delete</a></td></tr>');
				});
				$('.existingFavouritesData em').hide(); // hide "no Favourites" message
				$('.favouritesData').fadeIn(); // fadeIn existing Favourites table
			}
		}
	},

/*	editFavourite: function(editButton) {
		// create local scoped var to deal with input data in JSON format rather than a string
		var currentOptions = JSON.parse(localStorage.jiraplusplus_options);
	},*/

	deleteFavourite: function($deleteButton) {
		// create local scoped var to deal with input data in JSON format rather than a string
		var currentOptions = JSON.parse(localStorage.jiraplusplus_options),
			self = this,
			$deleteButton = $( $deleteButton ), // jQuery object for the delete button
			$name = $deleteButton.parent().parent().find('.name'), // jQuery object for the name
			$email = $deleteButton.parent().parent().find('.email'), // jQuery object for the email
			$tr = $deleteButton.parent().parent(), // jQuery object for the current row
			name = $name.html(), // name of Favourite to delete
			email = $email.html(); // email of Favourite to delete

		$.each(currentOptions.customAssignees, function(count, data) { // iterate over customAssignees
			if ( data.name === name && data.email === email) { // which one to delete?
				self.count = count; // which position in the customAssignees array to delete
				return false; // stop iteration
			}
		});

		currentOptions.customAssignees.splice(self.count, 1); // delete matching Favourite from localStorage
		localStorage.setItem('jiraplusplus_options', JSON.stringify(currentOptions)); // reset localStorage with our variable

		chrome.storage.sync.set(currentOptions);

		$tr.fadeOut(function() { // fadeout row that we just deleted
			$(this).remove(); // remove from DOM
		});
	}
};

JIRAPLUSPLUS_OPTIONS.init();