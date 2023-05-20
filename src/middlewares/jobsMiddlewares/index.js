const cheerio = require('cheerio');
const axios = require('axios');

const BASE_URL = 'https://www.jobstreet.com.ph';
const JOB_SEARCH_ENDPOINT = '/en/job-search/medical-technologist-jobs/';

const lists = async (req, res, next) => {
    try {

        const { page=1 } = req.query;

        let url = new URL(JOB_SEARCH_ENDPOINT, BASE_URL).href;
        url = new URL(page, url).href;

        const resp = await axios.get(url);

        const $ = cheerio.load(resp.data);

        let searchResultBar = $('div[data-automation=searchResultBar]').text();
        let currPage = $('#pagination').val();
        let lastPage = $('#pagination option:last').text();

        let start = 0, end = 0, total = 0;
        let m = /^(\d+)-(\d+) of (\d+) jobs$/.exec(searchResultBar.trim());

        if (m) {
            start = m[1];
            end = m[2];
            total = m[3];
        }

        const data = {
            currPage,
            lastPage,
            start,
            end,
            total,
        }
        const jobs = [];

        $('div[data-automation=jobListing]').children().each((i, el) => {
            let jobCardBannerSrc = $('img[data-automation=job-card-banner]', el).attr('src');
            let jobLogoSrc = $('div[data-automation=job-card-logo] img', el).attr('src');
            let header = $('h1', el).text();
            
            let headerLink = $('h1 a').attr('href');
            if (headerLink) {
                headerLink = new URL(headerLink, BASE_URL).href;
            }

            let subHeader = $('div h1+span', el).text();
            let offer = $('span ~ span', el).text();

            let jobCardSellingPoints = [];
            $('ul li', el).each(function () {
                jobCardSellingPoints.push($(this).text());
            });

            let location = $('div ~ span', el).text();
            let time = $('time', el).text();

            jobs.push({
                jobCardBannerSrc,
                jobLogoSrc,
                header,
                headerLink,
                subHeader,
                offer,
                jobCardSellingPoints,
                location,
                time,
            });
        });

        data.jobs = jobs;
        
        return res.json(data);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    lists,
}