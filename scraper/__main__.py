import course_scraper
import ucsb_api_client
import major_scraper


print('Running all scrapers together...')
course_scraper.main()
ucsb_api_client.main()
major_scraper.main()
