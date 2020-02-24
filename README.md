# Story Teller
## How to use
- Download the zip file or clone this repository and extract the folder **story-teller** into your app directory
- Load the **story-teller/story-teller.css** file into the html file where you want the component to be at.
- Import `StoryTeller` with `import StoryTeller from "./story-teller/story-teller.js";`
- Create a `new StoryTeller()` instance
- Load a json file like **example-story.json** with `storyTellerInstance.load(jsonUrl)`
- Append it to a container with `storyTellerInstance.append(container)`. An example bellow.
```javascript
import StoryTeller from "./story-teller/story-teller.js";

function load() {
  const storyTellerInstance = new StoryTeller();
  storyTellerInstance.load("url/to/story-file.json");
}

window.onload = load;
```
