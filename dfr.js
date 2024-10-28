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
  if (dataset.length===0|| (Array.isArray(dataset[0]) && dataset.length === 1)){return 0} // ensures array is valid 
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
   //checks df only has one column then adds each value to a single dimension array
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
      // skips row if index of current row is included in ignoreRows array
      if (!ignoreRows.includes(i)) {
        const cols = rows[i].split(",");
        numCols = cols.length
        let allowedCols = []

        for (let x = 0; x < cols.length; x++) {
          if (!ignoreCols.includes(x)) {
            //if column index is not included in ignoreCols then the column value is added to a temporary array
            allowedCols.push(cols[x]) 
          }
        }
        if (allowedCols.length >0) {
          //if filteredCols is not empty then it is added to newArray
          newArray.push(allowedCols)
        }
      }
  }
  return [newArray, rows.length, numCols]

} catch (error) {
  return [[],-1,-1]
}

}
console.log(loadCSV(
  "./sales_data.csv",
  [0], 
  [] 
))

function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {
  const result =[]

  for (let rows = 0; rows < dataframe.length; rows++) {
    if (dataframe[rows][columnIndex] === pattern || pattern == "*") {
      if (exportColumns.length===0) {
        //pushes rows to result if the specified column matches pattern or pattern is wildcard
        result.push(dataframe[rows])
      }
      else{
        // creates a new array containing the values from specified colums in exportColumns
        const selectedCols = exportColumns.map(index => dataframe[rows][index])
        result.push(selectedCols)
      }
    }
  }
  return result
}


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