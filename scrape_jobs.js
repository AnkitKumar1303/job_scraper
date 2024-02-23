const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require('xlsx');
let jobList = [];

// Function to fetch data from the job board
const fetchDataFromJobBoard = async () => {
  try {
    const response = await axios.get(
      "https://www.naukri.com/it-jobs?src=gnbjobs_homepage_srch",
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive',
        }
      }
    );
    const data = response.data;
    const $ = cheerio.load(data);
    const jobContainers = $('.jobTuple');
    $(jobContainers).each((index, element) => {
      let jobTitle = $(element).find('.title').text().trim();
      let companyName = $(element).find('.companyName').text().trim();
      let location = $(element).find('.location').text().trim();
      let jobType = $(element).find('.jobType').text().trim();
      let postedDate = $(element).find('.time').text().trim();
      let jobDescription = $(element).find('.job-description').text().trim();
      jobList.push({ jobTitle, companyName, location, jobType, postedDate, jobDescription });
    });

    console.log(jobList);

    // Create workbook 
    const workbook = xlsx.utils.book_new();
    
    // Prepare data for worksheet
    const sheetData = [
      ["Job Title", "Company Name", "Location", "Job Type", "Posted Date", "Job Description"],
      ...jobList.map((job) => [job.jobTitle, job.companyName, job.location, job.jobType, job.postedDate, job.jobDescription]),
    ];

    const workSheet = xlsx.utils.aoa_to_sheet(sheetData);
    
    // Append data to workbook
    xlsx.utils.book_append_sheet(workbook, workSheet, 'Job Postings');

    // Write data to XLSX file
    xlsx.writeFile(workbook, 'job_postings.xlsx');
    console.log('XLSX file created successfully!');

  } catch (error) {
    console.log(error);
  }
};

// Call the function to fetch data from the job board
fetchDataFromJobBoard();
