export const getUserSpecificEntries=(allEntries,userId)=>{
    let unfilteredEntries = {...allEntries};
    let filteredEntries = {};
    Object.keys(unfilteredEntries).forEach((value)=>{
        if(unfilteredEntries[value].userId==userId){
            filteredEntries[value]=unfilteredEntries[value]
        }
    });

    return filteredEntries;
};