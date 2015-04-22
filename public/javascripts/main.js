var treeModel;
var obj1;

var questions = {
	'gender': 'What is the gender of your character?',
	'livingStatus': 'Is your character alive or deceased?',
	'oscar': 'Has you character ever won an Oscar?',
	'cityBorn': 'Where is your character from?',
	'relationshipStatus': 'What is the marital status of your character?',
	'genre': 'What genre of movie does your character act in?',
	'ethnicity': 'What is the ethnicity of your character?'
};

$.ajax({
	url: '/tree',
	type: 'GET',
	dataType: 'json',
})
.done(function(tree) {
	
	treeModel = tree.tree;
	updateTree(treeModel);
	checkstat(treeModel);
})
.fail(function() {
	console.log("error");
});

$("#reset").click(function(event) {
	/* Act on the event */
	location.reload();
});

$('#submit').click(function(event) {

	/* Act on the event */
	var obj1= treeModel.children[$('input[name=options]:checked').val()];
	treeModel =obj1.children[0];
	$('.funkyradio').html('');
	$("#tree").empty();
	updateTree(treeModel);
	checkstat(treeModel);
});

function checkstat(obj) {
	switch(obj.type){
		case "result":
			result (obj);
			break;
		case "feature":
			feature (obj);
			break;
		case "feature_value":
			feature_value (obj);
			break;
		default:
			break;
	}
};

// Post the question

function feature (obj){
	$("#question-answer").html(questions[obj.name]);

	obj.children.forEach(function(element, index){
		$('.funkyradio').append(
			$('<div />', {
				'class': 'funkyradio-success'                      
	        }).append(
	            $('<input />', { 
	                type: 'radio', 
	                name: 'options',
	                id: 'radio'+index, 
	                value: index
	            } ),
	            $('<label />', {
	            	'text': element.name,
	            	'for': 'radio'+index
	            })
	        )
	        
	    );
	});
	
};

function feature_value (obj){
	$("#question-answer").html(obj.name);
};

// Print the result
function result (obj){
	$("#question-answer").html(" ");
	var imgName = obj.name.split(" ").splice(-1);
	$("#avatar").append(
		$('<div />', {
			class: 'col-md-3 col-md-offset-2'
		}))
		.append( 
			$('<img />', {
			src: 'images/'+imgName+'.jpg',
			class: 'avatar'
		}));
	$("#name").append( 
			$('<div />', {
			class: 'col-md-4 col-md-offset-4',
			stye: 'margin-top:10px',
			text: obj.name
		}));

	$('#submit').hide();
	
};


// Draw the tree
function updateTree(data) {

	var width = 1600,
    height = 1600;

	var tree = d3.layout.tree()
	    .size([height, width - 160]);

	var diagonal = d3.svg.diagonal()
	    .projection(function (d) {
	        return [d.x, d.y];
	    });

	var svg = d3.select("#tree").append("svg")
	    .attr("width", "100%")
	    .attr("height", "100%")
	    .attr("viewBox", "0 0 1600 1500") 
	    .append("g")
	    .attr("transform", "translate(5,50)");

	var root =  data,
	    nodes = tree.nodes(root),
	    links = tree.links(nodes);

	var link = svg.selectAll(".link")
	    .data(links)
	    .enter()
	    .append("g")
	    .attr("class", "link");

	link.append("path")
	    .attr("fill", "none")
	    .attr("stroke", "#ff8888")
	    .attr("stroke-width", "1.5px")
	    .attr("d", diagonal);

	link.append("text")
	    .attr("font-family", "Arial, Helvetica, sans-serif")
	    .attr("fill", "Black")
	    .style("font", "normal 12px Arial")
	    .attr("transform", function(d) {
	        return "translate(" +
	            ((d.source.x + d.target.x)/2) + "," + 
	            ((d.source.y + d.target.y)/2) + ")";
	    })   
	    .attr("dy", ".135em")
	    .attr("text-anchor", "middle")
	    .text(function(d) {
	        console.log(d.target.rule);
	         return d.target.rule;
	    });

	var node = svg.selectAll(".node")
	    .data(nodes)
	    .enter()
	    .append("g")
	    .attr("class", function(n){
	        if (n.children) {
	            return "relationship"
	        } else {
	            return "node"
	        }
	    })
	    .attr("transform", function (d) {
	        return "translate(" + d.x + "," + d.y + ")";
	    });

	node.append("circle")
	    .attr("r", 4.5);

	node.append("text")
	    .attr("dx", function (d) {
	        return d.children ? -8 : 8;
	    })
	    .attr("dy", 20)
	    .style("text-anchor", function (d) {
	        return d.children ? "end" : "start";
	    })
	    .text(function (d) {
	        return d.name;
	    });
 };