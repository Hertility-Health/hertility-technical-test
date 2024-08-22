## Hertility engineering technical test

Welcome to the Hertility Health Engineering Technical Test. This is a non-timed technical test which you may complete at your own pace. This test is for fullstack engineers so you will be simultaneously working across two directories: one for the frontend and one for the backend. 

### Guidelines
1. Install any npm you wish to use in this challenge.
1. Styling is encouraged but not necessarily required as this test is mainly a gauge of your Typescript ability—you may use whichever methods of styling you prefer.
1. Aim to complete the challenge in under 60 minutes.
1. Once complete, you may open a pull request to the main repository or alternatively, send us a zip file of your code via email (excluding the `node_modules` directory).

### Prerequisites
- [Node.js version 20 or higher installed](https://nodejs.org/en/download/package-manager)

### Setup

 Start by cloning the repository:
 ```
 git clone https://github.com/Hertility-Health/hertility-technical-test.git
 ```

You will now need two terminals open at the same time to run the development environment. One to run the frontend and one to run the backend.

#### Terminal #1
1. cd into the `frontend` directory
2. run `npm install`
3. run `npm run dev`

#### Terminal #2
1. cd into the `backend` directory
2. run `npm install`
3. run `npm run dev`

The frontend should be accessible at `http://localhost:5173/`

The backend should be accessible at `http://localhost:52863/`

### The challenge
Here at Hertility, we process and evaluate hundreds of hormone results every single day. This technical test will be based around a replica admin dashboard used to view the status of newly analysed samples from the lab. Each person may be measured for a different set of hormones based on their individual reasons for testing and we must deal with these results appropriately.

#### Task 1
We want to be able to see the status of each set of results at a glance. To do so, implement the following:

Using this object defining normal hormone ranges, populate the third `STATUS` column on the admin dashboard indicating if a received set of results are "IN RANGE" (all measured hormones in range) or "NOT IN RANGE" (at least one measured hormone out of range).

normal hormone ranges.
```json
{
  "AMH": {
    "min": 7.14,
    "max": 95
  },
  "FT4": {
    "min": 12,
    "max": 22
  },
  "PROL": {
    "min": 102,
    "max": 496
  },
  "OEST": {
    "min": 45,
    "max": 854
  },
  "FSH": {  
    "min": 6,
    "max": 12.5
  },
  "LH": {
    "min": 2.4,
    "max": 12.6
  },
  "TEST": {
    "min": 0.5,
    "max": 2
  },
  "SHBG": {
    "min": 32.4,
    "max": 128
  }
}
```

#### Task 2
Now we can see the status of each set of results, we would like to filter the results based on this status so we can see which results will require investigation.

Create a filtering functionality which allows filtering of results to display based on status. This should be an intuitive UI component of your choice which allows the selection of a single status to show. E.g. selecting "IN RANGE" should only show results with all hormones in range.

#### Task 3 (if you have time)
We now want to see why a result is not in range. Add a way to see why a result is not in range in a human-readable way. This can be anything from an expandable menu, a hover tooltip, modal or even an extra column.

Once complete, open a pull request to the main repository or alternatively, send us a zip file of your code via email (excluding the `node_modules` directory).