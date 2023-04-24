# Data Visualisation Project - Spring 2023


### Visualisations : ✅
- BeeSwarm
    - The graph categories different events over the time.
    - The user can select the timeframes via the sliders.
- Bar chart
    - It shows the top authors and hashtags over the time with the tweet count.
    - The user can choose hashtags or authors to be shown by the dropdown.
- Pie chart
    - Various sentiments are being analyzed by the pie chart.
- Word cloud
    - Word cloud is implement in python
    - Based on the checked values and time frames selected an api call is made to python server to generate a
    word loud of major words used across the messages.
    - The generated word cloud is then showed in the html page.
- Arc diagram
    - The diagram connects the authors based on the events on which they are tweeting.
- Spline graph
    - It represents the risk of threat to the public at the given point in time.
- Point Map
    - The points on the map represents the location from which message has been sent.
    - When we hover over the point, it connects to the other points of message which are related to the same event.

### Widgets  : ✅
- Event check boxes
  - The user can check the events, to filter out the data.
- Trends dropdown
  - Select dropdown to show trends of whether authors or hashtags
- Play button
  - When user clicks on the button, animation is played to show the trends in messages over the time on point map
- Range slider
  - When the slider is dragged, an animation is played on the points on the messages from that point of time to the end.

### Tooltips : ✅
- Bee swarm tooltip
- Bar chart tooltip
- Pie chart tooltip
- Point map tooltip



### Steps to run the project : 🏁
1. Clone the project and cd to project folder
2. install the required python modules by running the command <br />
   ```pip install flask pandas WordCloud matplotlib```
3. Then the run the following command to start the python server <br /> ```flask --app wc_images/dv_project.py run --host=0.0.0.0 --port=80```
4. Run the ```index.html``` using any server. We used python server to host the web application locally using the following command <br/> ```python -m http.server 9000```
