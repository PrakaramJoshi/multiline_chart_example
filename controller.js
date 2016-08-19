'use strict';

	var chart_custom =function(){
	var  NetworkComponent =function(){
		var graphs=[]
		function fill_graph(_graph){

			if (typeof d3 === 'undefined' || d3 === null) {
				//wait for d3 to load
				window.setTimeout(function(){
					fill_graph(_graph)},10);
			}
			else{
				lineChart("#"+_graph.graph_name,_graph.file,_graph.y_axis)
			}
		}

		function create_graphs(){
			for(var i=0;i<graphs.length;i++){
				fill_graph(graphs[i])
			}
		}
		function init_graphs(){
			graphs.push({graph_name:'graph_1',file:"range.tsv",y_axis:"Device Count",title:"Graph 1"})
			create_graphs()
		}
	  function init() {
			init_graphs()
	  }
		init()
	}()}();
