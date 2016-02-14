/* globals google */

var React = require('react');
var EmotionsStore = require('../stores/emotions_store');
var ApiUtil = require('../util/api_util');

var PieChart = React.createClass({

  getInitialState: function(){
    this.emotionsHash = {};
    return {emotions: EmotionsStore.allEmotions()};
  },

  _emotionsChanged: function(){
    this.setState({emotions: EmotionsStore.allEmotions()});
    this.gatherInfo();
  },

  componentWillUnmount: function(){
    this.emotionListener.remove();
    this.chart.clearChart();
  },

  componentWillMount: function(){
    this.emotionListener = EmotionsStore.addListener(this._emotionsChanged);
  },

  componentDidMount: function(){
    this.gatherInfo();
  },

  gatherInfo: function(){
    this.state.emotions.forEach(function(emotionSet){
      this.emotionsHash["anger"] = emotionSet["anger"];
      this.emotionsHash["contempt"] = emotionSet["contempt"];
      this.emotionsHash["disgust"] = emotionSet["disgust"];
      this.emotionsHash["fear"] = emotionSet["fear"];
      this.emotionsHash["happiness"] = emotionSet["happiness"];
      this.emotionsHash["neutral"] = emotionSet["neutral"];
      this.emotionsHash["sadness"] = emotionSet["sadness"];
      this.emotionsHash["surprise"] = emotionSet["surprise"];
    }.bind(this));
    google.charts.setOnLoadCallback(this.drawChart);
  },

  drawChart: function() {
    var emotionsArray = [["Emotion", "Level"]];

    Object.keys(this.emotionsHash).forEach(function(key){
      emotionsArray.push([key, this.emotionsHash[key]]);
    }.bind(this));

    var data = google.visualization.arrayToDataTable(emotionsArray);

    var options = {
      title: 'Emotional Percentage'
    };

    this.chart = new google.visualization.PieChart(document.getElementById('pie_chart'));

    this.chart.draw(data, options);
  },

  render: function(){
    return (
      <div id="pie_chart"></div>
    );
  }
});

module.exports = PieChart;
