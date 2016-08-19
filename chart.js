
var lineChart= function(_graph_name,_file_path,_yaxis){
	function type(d, _, columns) {
		var parseTime = d3.timeParse("%d-%b-%y");
	  d.date = parseTime(d.date);
	  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
	  return d;
	}
  class LineChart{
      init_size(_name){
				var width = parseInt(d3.select(_name)._groups[0][0].clientWidth)
        var height = width *0.3
        this.margin = {top: 20, right: 20, bottom: 30, left: 50},
        this.width = width - this.margin.left - this.margin.right,
        this.height = height - this.margin.top - this.margin.bottom;
      }
      init_chart(_name){
        this.x = d3.scaleTime()
            .range([0, this.width]);

        this.y = d3.scaleLinear()
            .range([this.height, 0]);

				this.z = d3.scaleOrdinal(d3.schemeCategory10);
				this.svg=d3.select(_name).select("svg")
				if(!this.svg.empty()){
					this.svg.remove()
				}
				this.svg = d3.select(_name).append("svg")
        this.svg.attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)

				this.g =this.svg.append("g")
					.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

      }
      init_lines(){
				var this_obj=this
				this.line = d3.line()
					    .curve(d3.curveBasis)
					    .x(function(d) { return this_obj.x(d.date); })
					    .y(function(d) { return this_obj.y(d.val); });
      }
      constructor(){
				this.event_listners_added =false
      }
      update_chart(_name,_tsv_file,_y_axis){
				var width =0;
				if(d3.select(_name)._groups[0][0]!=null){
					width = parseInt(d3.select(_name)._groups[0][0].clientWidth)
				}
				var this_obj=this
				if(width==0){
					setTimeout(function(){
						this_obj.update_chart(_name,_tsv_file,_y_axis)
					},10)
					return
				}
				if(this.event_listners_added==false){
					window.addEventListener('resize', function(){
						this_obj.update_chart(_name,_tsv_file)
					});
					this.event_listners_added =true;
				}
				this.init_size(_name)
        this.init_chart(_name)
        this.init_lines()


        d3.tsv(_tsv_file, type, function(error, data) {
          if (error) throw error;

					var categories = data.columns.slice(1).map(function(id) {
				    return {
				      id: id,
				      values: data.map(function(d) {
				        return {date: d.date, val: d[id]};
				      })
				    };
				  });

          this_obj.x.domain(d3.extent(data, function(d) { return d.date; }));
					this_obj.y.domain([
					    d3.min(categories, function(c) { return d3.min(c.values, function(d) { return d.val; }); }),
					    d3.max(categories, function(c) { return d3.max(c.values, function(d) { return d.val; }); })
					  ]);
					this_obj.z.domain(categories.map(function(c) { return c.id; }));

          this_obj.g.append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0," + this_obj.height + ")")
              .call(d3.axisBottom(this_obj.x));

          this_obj.g.append("g")
              .attr("class", "axis axis--y")
              .call(d3.axisLeft(this_obj.y))
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
							.attr("fill", "#000")
              .text(_y_axis);

				var category = this_obj.g.selectAll(".category")
	     						.data(categories)
	     						.enter().append("g")
	       					.attr("class", "category");

					category.append("path")
				      .attr("class", "line")
				      .attr("d", function(d) { return this_obj.line(d.values); })
				      .style("stroke", function(d) { return this_obj.z(d.id); });

					category.append("text")
		      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
		      .attr("transform", function(d) { var x_translate=this_obj.x(d.value.date)-(d.id.length*6);return "translate(" + x_translate + "," + this_obj.y(d.value.val) + ")"; })
		      .attr("x", 3)
		      .attr("dy", "0.35em")
		      .style("font", "10px sans-serif")
		      .text(function(d) { return d.id; });
        });
      }
  }
  var lineChart = new LineChart()
  lineChart.update_chart(_graph_name,_file_path,_yaxis)

}
