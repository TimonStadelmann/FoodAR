export function getImageLink(search) {
	const queryParams = {
		q: search,
		cx: '850e1dffcd2124733',
		key: import.meta.env.VITE_GOOGLE_SEARCH_API_KEY,
		imgColorType: 'color',
		imgSize: 'huge',
		safe: 'active',
		num: 1,
		searchType: 'image',
		imgType: 'photo',
		gl: 'at',
		hl: 'de',
		rights: 'cc_attribute cc_nonderived',
		siteSearch: 'instagram.com facebook.com',
		siteSearchFilter: 'e'
	};

	const url = 'https://www.googleapis.com/customsearch/v1?' + new URLSearchParams(queryParams).toString();

	const requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	return fetch(url, requestOptions)
		.then((response) => response.json())
		.then((result) => {
			if (result.items && result.items[0]) {
				return result.items[0].link; // Returns the image URL
			}
			throw new Error('No image found');
		});
}
