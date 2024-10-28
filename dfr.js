const fs = require("fs");

function fileExists(filename) {
  return fs.existsSync(filename);
}

function validNumber(value) {
  return /^-?\d*\.?\d+$/.test(value.toString())
}

function dataDimensions(dataframe) {
   // returns a list [rows (int), cols (int)]
   let rows = 0, cols = 0
   if (dataframe == undefined) {
     return [-1,-1]
   }
   if (!Array.isArray(dataframe[0])) {
     rows = dataframe.length
     cols = 0
   }
   else{ 
     dataframe.forEach(row => {
       rows++ 
       cols = row.length 
     });
   }
   
   return rows== 0 && cols == 0 ? [-1,-1] :
   rows == 0 && cols != 0 ? [-1, cols] :
   rows != 0 && cols == 0 ? [rows, -1] : 
   [rows, cols]
}

function findTotal(dataset) {
  // returns float or false
  let total = 0
  if (dataset.length===0|| (Array.isArray(dataset[0]) && dataset.length === 1)){return 0}
    dataset.forEach(row => {
      if (Array.isArray(row)) {
        row.forEach(value => {
          if (validNumber(value)){
            total+=parseFloat(value)
          }
        })
      }
      else{
        if (validNumber(row)){
          total+=parseFloat(row)
        }
      }
    })
    return total
  
}

function calculateMean(dataset) {
   // returns a float or false
   let total = 0
   let count = 0
   if (dataset.length===0|| (Array.isArray(dataset[0]) && dataset.length === 1)){return 0}
     dataset.forEach(row => {
       if (Array.isArray(row)) {
         row.forEach(value => {
           if (validNumber(value)){
             total+=parseFloat(value)
             count++
           }
         })
       }
       else{
         if (validNumber(row)){
           total+=parseFloat(row)
           count++
         }
       }
     })
     return total/count
}

function calculateMedian(dataset) {
  // filters dataset to only include valid numbers
  dataset = dataset.filter(element => validNumber(element))
  // returns false if dataset is not valid
  if (dataset.length===0|| (Array.isArray(dataset[0]) && dataset.length === 1)){return 0}
  dataset.sort((a, b) => a - b);
  let i = (dataset.length)/2
  // find average of middle 2 numbers if length is even, if odd then returns the value in the middle as a float
  return dataset.length%2 === 0 ? ( dataset[i] +  dataset[i -1])/2 : parseFloat(dataset[i - 0.5])
}

function convertToNumber(dataframe, col) {
   // returns an integer, which is the number that were  converted to floats.
   let count = 0;

   for (const row of dataframe) {
     originalValue = row[col]
   
     // Check if the original value is a valid number but not already a float
     if (validNumber(originalValue) && typeof originalValue !== 'number') {
       row[col] = parseFloat(originalValue);
       count++;
     }
   }
 
   // Return the count of values converted
   return count;
   
}

function flatten(dataframe) {
   // returns a dataset (a flattened dataframe)
   let newArray = []
   if (dataDimensions(dataframe)[1] == 1) {
     for(row in dataframe){
       newArray.push(dataframe[row][0])
     }
   }
   return newArray
}

function loadCSV(csvFile, ignoreRows = [], ignoreCols = []) {
  // returns a list comprising of [dataframe, rows (integer), cols (integer)]
  try {
    
    const data = fs.readFileSync(csvFile, "utf-8")
    const rows = data.split(/\n/)
    let numCols = 0
    let newArray = []
   
    for (let i = 0; i < rows.length; i++) {
      if (!ignoreRows.includes(i)) {
        const cols = rows[i].split(",");
        numCols = cols.length
        let filteredCols = [];

        for (let x = 0; x < cols.length; x++) {
          if (!ignoreCols.includes(x)) {
            filteredCols.push(cols[x]) 
            
          }
        }
        if (filteredCols.length >0) {
          newArray.push(filteredCols)
        }
      
      }
  }
  return [newArray, rows.length, numCols]

} catch (error) {
  return [[],-1,-1]
}

}
//console.log(loadCSV("./sales_data.csv", [0], [0,5,6]))

function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {
  
  const result =[]

    for (let rows = 0; rows < dataframe.length; rows++) {
     // for (let cols = 0; cols < rows.length; cols++) {
        if (dataframe[rows][columnIndex] === pattern || pattern == "*") {
          if (exportColumns.length===0) {
            
            result.push(dataframe[rows])
          }
          else{
            const selectedCols = exportColumns.map(index => dataframe[rows][index])
            result.push(selectedCols)
          }
        }
        
      //}
      
    }
  
  return result
}

const salesData = [
  ["region", "product", "sales", "profit"], 
  ["north", "laptop", 1000, 200],
  ["south", "phone", 500, 100],
  ["north", "tablet", 750, 150],
  ["east", "laptop", 1200, 240],
];

console.log(createSlice(salesData, 0 , "north"))

module.exports = {
  fileExists,
  validNumber,
  dataDimensions,
  calculateMean,
  findTotal,
  convertToNumber,
  flatten,
  loadCSV,
  calculateMedian,
  createSlice,
};