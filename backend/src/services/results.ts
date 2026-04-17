interface HormoneResults {
    code: string;
    units: string;
    value: number;
}

interface Results {
	id: number;
    userId: number;
    hormoneResults: Array<HormoneResults>;
}
type Range ={
    min:number;
    max:number;
};

const normalHormoneRanges :Record<string,Range>={
    "AMH": {
      "min": 7.14,
      "max": 95
    },
    "FT4": {
      "min": 12,
      "max": 22
    },
    "PROL": {
      "min": 102,
      "max": 496
    },
    "OEST": {
      "min": 45,
      "max": 854
    },
    "FSH": {  
      "min": 6,
      "max": 12.5
    },
    "LH": {
      "min": 2.4,
      "max": 12.6
    },
    "TEST": {
      "min": 0.5,
      "max": 2
    },
    "SHBG": {
      "min": 32.4,
      "max": 128
    }
  };

export function calculateStatus (result : Results): "IN RANGE" | "NOT IN RANGE" {
    const inRange=result.hormoneResults.every((hormone)=>{
        const range =normalHormoneRanges[hormone.code];
        if(!range){
            return false;
        }
        return(
            hormone.value >= range.min && hormone.value <= range.max
        );
    });
    return inRange ? "IN RANGE" : "NOT IN RANGE"
}
// this would normally be a database query - you don't need to change this function
export async function fetchResults() {
    const json: { default: Results[] } = await import("../data/results.json", {
        with: { type: "json" },
    });
	const results = json.default;
    return results;
}
