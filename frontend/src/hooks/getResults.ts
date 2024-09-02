import { Results } from "src/types";

export const getResults = async (): Promise<Results[]> => {
    const response = await fetch('http://localhost:52863/results');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};