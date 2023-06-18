from flask import Flask, jsonify, send_from_directory
import arxiv
import openai
import random


openai.api_key = '<Open ai api key here>' 

app = Flask(__name__, static_folder='images')

topics = ['quantum physics', 'machine learning', 'Artificial Intelligence']  # add more topics as needed

@app.route('/', defaults={'domain': None})

@app.route('/<domain>', methods=['GET'])
def get_articles(domain):
    if domain is None:
        search_query = 'Most recent and trending papers in Machine leanring, Artificial intelligence, Biology and quantum computing.'
    else:
        search_query = domain

    # Search parameters
    # search_query = 'most Recent papers on ' + domain
    max_results = 5

    # Query arXiv API
    search = arxiv.Search(
        query = search_query,
        max_results = max_results
    )

    data = []
    # Iterate through each paper
    for result in search.results():
    # for result in client.results(search=search, offset=0):



        # Create an updated summary in 3rd person
        prompt_summary_desc = f"This is the summary of a research paper:\n {result.summary}\n\n Generate a good short description in one paragraph of 80 to 120 words in 3rd person.\n Description:"
        response_summary_desc = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt_summary_desc,
            temperature=0.5,
            max_tokens=3000
        )
        updated_summary_summary = response_summary_desc.choices[0].text.strip()

        # Create a short form to be used as a prompt for use to see the whole paper
        prompt_summary_short = f"This the summary of research paper: {updated_summary_summary}. Write a text to inform user to tap to read whole paper. It should be custom to the paper. make sure it doesnt exceed 5-10 words"
        response_summary_short = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt_summary_short,
            temperature=0.5,
            max_tokens=3000
        )

        updated_summary_short = response_summary_short.choices[0].text.strip()

        prompt_image_desc = f"Covert the following summary into a description of an image in a few words that can be used as a prompt to a text-to-image model.\n Summary:\n{updated_summary_summary}\n Image Description:\n"
        response_image_desc = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt_image_desc,
            temperature=0.5,
            max_tokens=3000
        )
        updated_summary_image = response_image_desc.choices[0].text.strip()

        try:
            imageResponse = openai.Image.create(
                prompt=updated_summary_image,
                n=1,
                size="512x512")
            image_url = imageResponse['data'][0]['url']
        except:
            image_url = 'https://dummyimage.com/600x400/000/fff.jpg&text=Image+Generation+Failed'

        article_data = {
            'title': result.title,
            # 'summary': result.summary,
            # 'image_text': updated_summary_image,
            'summary': updated_summary_summary,
            'read_more_text': updated_summary_short,
            'date': result.published,
            'pdf_url': result.pdf_url,
            'image_url': image_url
        }
        data.append(article_data)


    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8000)