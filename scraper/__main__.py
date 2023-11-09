import scraper.ucsb.course_scraper as course_scraper
import scraper.ucsb.ucsb_api_client as ucsb_api_client
import scraper.ucsb.major_scraper as major_scraper


print('Running all scrapers together...')
course_scraper.main()
ucsb_api_client.main()
major_scraper.main()
