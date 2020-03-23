
export const fireBaseRequestFactory = (apiKey, collectionName) => {
    if (!apiKey.endsWith('/')) {
        throw new Error('The api key must end with "/"');
    }

    let collectionUrl = apiKey + collectionName;

    const getAll = () => {
        return fetch(collectionUrl + '.json').then(x => x.json());
    };

    const getById = (id) => {
        return fetch(`${collectionUrl}/${id}.json`).then(x => x.json());
    };

    
    const createEntity = (entityBody) => {
        return fetch(collectionUrl + '.json', {
            method: 'POST',
            body: JSON.stringify(entityBody)
        }).then(x => x.json());
    };

    const updateEntity = (entityBody, id) => {
        return fetch(`${collectionUrl}/${id}.json`, {
            method: 'PUT',
            body: JSON.stringify(entityBody)
        }).then(x => x.json());
    };

    const patchEntity = (entityBody, id) => {
        return fetch(`${collectionUrl}/${id}.json`, {
            method: 'PATCH',
            body: JSON.stringify(entityBody)
        }).then(x => x.json());
    };
    
    const deleteEntity = (id) => {
        return fetch(`${collectionUrl}/${id}.json`, {
            method: 'DELETE'
        }).then(x => x.json());
    };

    return {
        getAll,
        getById,
        createEntity,
        updateEntity,
        patchEntity,
        deleteEntity
    };
};


