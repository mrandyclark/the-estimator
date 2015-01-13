PageManager = function () { };

PageManager.prototype.init = function () {
	this.setDatabase(); // replaced by database!

	this.drawCapabilities(); // replaced by node!
	this.drawSizingsTable(); // replaced by node!

	// events
	this.bindEvents();
	return false;
};


//
// bind events to elements on the page
//
PageManager.prototype.bindEvents = function() {

	$("#capability-list ul li").on(
		"click",
		$.proxy(this.handleFeatureClick, this)
	);

	$(document).on(
		"click",
		".glyphicon-remove",
		$.proxy(this.handleRemovalClick, this)
	);
	return false;
};

//
// add a feature to the current project sizing
//
PageManager.prototype.handleFeatureClick = function(evt) {
	evt.preventDefault();
	var $el = $(evt.target).closest("li");

	var capabilityId = $el.data("capability-id");

	var $tbody = this.constructCapability(capabilityId);

	return false;
};

// 
// remove a feature from the current project sizing
// handle capabilities vs features
// 
PageManager.prototype.handleRemovalClick = function(evt) {

	evt.preventDefault();
	var $el = $(evt.target).closest("span");
	var $row = $el.closest("tr");
	var isCapabilityRow = $row.hasClass("capability-row")
	var question = isCapabilityRow
		? "Are you sure you want to remove this capability?"
		: "Are you sure you want to remove this feature?";

	var confirmed = window.confirm(question);

	if(confirmed && isCapabilityRow)
	{
		return isCapabilityRow	
			? $row.closest("tbody").remove()
			: $row.remove();
	}

	return false;
};

//
// construct a capability (tbody) in the sizing table
//
PageManager.prototype.constructCapability = function(capabilityId) {

	// the capability from our db
	var capability = _.findWhere(
		this.db.capabilities,
		{id: capabilityId }
	);

	// the default features of that capability
	var features = _.filter(
		this.db.features,
		function(feature) {
			return capability.defaultFeatures.indexOf(feature.id) > -1;
		}
	);


	var drawFeature = $.proxy(this.drawFeatureRow, this)

	var $tbody = $("<tbody />");

	// draw the feature row. this handles the basic functionality of that feature.
	var $header = drawFeature(capability.name, capability.defaultSizings, true);
	$tbody.append($header);
	
	// loop through each feature and append a child row to the tbody
	_.each(
		features,
		function(feature) {
			var $row = drawFeature(feature.name, feature.defaultSizings, false);
			$tbody.append($row);
		}
	);
	
	return $("#sizings-table").append($tbody);
}

//
// draw the feature row. includes the sizings for that feature.
//
PageManager.prototype.drawFeatureRow = function(name, sizings, isCapabilityRow) {

	var $row = $("<tr />")

	if(isCapabilityRow) { $row.addClass("capability-row"); }

	$row.append(
		"<td><span class='glyphicon glyphicon-remove'></td>"
	);

	$row.append(
		"<td class='feature-name'>" + name + "</td>"
	);

	_.each(
		this.db.teams,
		function(team) {
			var sizing = sizings[team.id];

			if(typeof sizing == "undefined") {
				$row.append("<td contenteditable='true'>--</td>")
			} else {
				$row.append("<td contenteditable='true'>" + sizing.days +"</td>")	
			}
		}
	);

	return $row;
}

//
// draw overall capabilities list.
//
PageManager.prototype.drawCapabilities = function() {
	var $container = $("#capability-list");
	var $ul = $("<ul class='list-unstyled' />")

	_.each(
		_.sortBy(this.db.capabilities, "name"),
		function(capability) {
			var $li = $("<li />")
			$li.append(capability.name);
			$li.data("capability-id", capability.id);
			$ul.append($li);
		}
	)

	$container.append($ul);
	return false;
};

//
// eventually moved to serverside drawing
//
PageManager.prototype.drawSizingsTable = function() {
	var $container = $("#sizings")
	var $table = $("<table class='table table-condensed' id='sizings-table'>");
	var $thead = $("<thead />");
	var $theadRow = $("<tr />");
	
	$theadRow.append("<td />"); // for (x) controls
	$theadRow.append("<td />"); // for capability/feature name

	// loop through each team and create a column for them
	// will need to add order checking to make sure the sizings
	// are added correctly once we start adding them
	_.each(
		this.db.teams, 
		function(team) {
			var $th = $("<th />");
			$th.append(team.name);
			$th.data("team-id", team.id);
			$theadRow.append($th);
		}
	);
	
	$thead.append($theadRow);
	$table.append($thead);
	$container.append($table);
	return false;
};


//
// this is a static 'database' that would eventually get moved to mongo 
// and be updated through an admin interface
//
PageManager.prototype.setDatabase = function() {

	// replaced by mongo eventually
	this.db = {};

	// teams at markit
	this.db.teams = [
		{ name: "Access & Authorization", id: 1},
		{ name: "Analytics", id: 2},
		{ name: "ADC", id: 3},
		{ name: "DE", id: 4},
		{ name: "Engineering", id: 5},
		{ name: "FeedMe", id: 6},
		{ name: "MDE", id: 7},
		{ name: "Mobile", id: 15},
		{ name: "OPS", id: 8},
		{ name: "PRE", id: 9},
		{ name: "QA", id: 10},
		{ name: "RDE", id: 11},
		{ name: "SQL", id: 12},
		{ name: "Web Engineering", id: 13},
		{ name: "Web Dev", id: 14}
	];

	// capabilities are overarching functions on a  site
	this.db.capabilities = [
		{
			id: 1,
			name: "Screener",
			defaultFeatures: [ 1, 2, 4],
			defaultSizings: { // teamid: sizing
				7: { days: 10, tshirt: "S" },
				12: { days: 20, tshirt: "M" },
				14: { days: 30, tshirt: "M" }
			}
		},
		{
			id: 2,
			name: "Alerts",
			defaultFeatures: [3, 5],
			defaultSizings: { // teamid: sizing
				4: { days: 30, tshirt: "M"}, 
				14: { days: 60, tshirt: "S" }
			}
		},
		{
			id: 3,
			name: "News",
			defaultFeatures: [],
			defaultSizings: { // teamid: sizing
				6: { days: 10, tshirt: "S"},
				14: { days: 20, tshirt: "M" }
			}
		},
		{
			id: 4,
			name: "New Site",
			defaultFeatures: [],
			defaultSizings: {
				8: { days: 15, tshirt: "M" },
				14: { days: 5, tshirt: "S" }
			}
		}
	];

	// features belong to capabilities.
	this.db.features = [
		{
			id: 1,
			name: "Save Screen",
			defaultSizings: { // teamid: sizing
				12: { days: 1, tshit: "XS" },
				14: { days: 10, tshirt: "M" }
			}
		},
		{
			id: 2,
			name: "Share Screens",
			defaultSizings: { // teamid: sizing
				14: { days: 5, tshirt: "S" }
			}
		},
		{
			id: 3,
			name: "Push Notifications",
			defaultSizings: { // teamid: sizing
				4: { days: 10, tshirt: "M"}, 
				14: { days: 5, tshirt: "S" },
				15: { days: 30, tshirt: "L"}
			}
		},
		{
			id: 4,
			name: "Print Screened Data",
			defaultSizings: { // teamid: sizing
				14: { days: 10, tshirt: "S" }
			}
		},
		{
			id: 5,
			name: "Email Alerts",
			defaultSizings: { // teamid: sizing
				4: { days: 10, tshirt: "M"}, 
				14: { days: 5, tshirt: "S" }
			}
		}
	];
}