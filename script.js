let grid = document.getElementById("grid");
let start = document.getElementById("set-start");
let end = document.getElementById("set-end");
let start_pos = [1,1];
let end_pos  = [20,20];
let rock_pos_list=[];
let state = 0;             // 0 for adding obstacle 1 for adding start 2 for adding end
updateBoard();

start.addEventListener('click',()=>{
    end.classList.remove('selected');
    start.classList.add('selected');
    state = 1;
});

end.addEventListener('click',()=>{
    start.classList.remove('selected');
    end.classList.add('selected');
    state = 2;
});




function updateBoard()
{   


    let noRows = 20;
    let noCols = 20;
    let bheight = Math.floor(1000/noRows);
    let bwidth = Math.floor(1000/noCols);
    
    for(let r = 1 ; r<=noRows ; r++)
    {
        let nthRow = document.createElement("div");
        nthRow.className = "nth-row";
        nthRow.id = "r"+r;
        nthRow.style.height = bheight+"px";
        nthRow.style.width = 1000+"px";
        grid.appendChild(nthRow);
        
        for(let c = 1 ; c <= noCols ; c++)
        {
            let block = document.createElement('div');
            console.log(r,c,"block created")
            block.id = "r"+r+"c"+c;
            block.className = "grid-block";
            block.style.height = bheight+"px";
            block.style.width = bwidth+"px";
            
            if(r===1 && c===1)
                block.classList.add('start-block');
            
            if(r===20 && c===20)
            {
                block.classList.add('end-block');
            }

            block.addEventListener('click',()=>{
                let [r,c] = extractIndex(block.id);
                let index = getIndexofArray(rock_pos_list,[r,c]);
                if(state === 0)
                {   
                    if(start_pos[0] != r || start_pos[1] != c)
                    {   
                        block.classList.toggle('stone');
                        console.log(r,c,"changed");

                        if(index >= 0)
                        {
                            console.log(r,c,"removed");
                            rock_pos_list.splice(index,1);    
                        }
                        else
                        {
                            console.log(r,c,"added");
                            rock_pos_list = rock_pos_list.concat([[r, c]]);
                        }
                    }
                }
                else if(state === 1)
                {
                    if(end_pos[0] != r || end_pos[1] != c)
                    {    
                        let prev_start = "r"+start_pos[0]+"c"+start_pos[1];
                        block.classList.remove('stone');
                        document.getElementById(prev_start).classList.remove('start-block');
                        start_pos[0] = r;
                        start_pos[1] = c;
                        block.classList.add('start-block');
                        state = 0;
                        start.classList.remove('selected');
                        
                        if(index >= 0)
                        {
                            console.log(r,c,"removed");
                            rock_pos_list.splice(index,1);    
                        }
                        else
                        {
                            console.log(r,c,"added");
                            rock_pos_list = rock_pos_list.concat([[r, c]]);
                        }
                    }
                }
                else
                {
                    if(start_pos[0] != r || start_pos[1] != c)
                    {    
                        let prev_end = "r"+end_pos[0]+"c"+end_pos[1];
                        block.classList.remove('stone');
                        document.getElementById(prev_end).classList.remove('end-block');
                        end_pos[0] = r;
                        end_pos[1] = c;
                        block.classList.add('end-block');
                        state = 0;
                        end.classList.remove('selected');
                        
                        if(index >= 0)
                        {
                            console.log(r,c,"removed");
                            rock_pos_list.splice(index,1);    
                        }
                        else
                        {
                            console.log(r,c,"added");
                            rock_pos_list = rock_pos_list.concat([[r, c]]);
                        }
                    }

                }   
            })    
            
            nthRow.appendChild(block);
        }
    } 
}

function getIndexofArray(array, item) {
    for (var i = 0; i < array.length; i++) {
        // This if statement depends on the format of your array
        if (array[i][0] == item[0] && array[i][1] == item[1]) {
            return i;   // Found it
        }
    }
    return -1;   // Not found
}

function extractIndex(id) {
    if(id.length === 4)
    {
        return [parseInt(id[1]) , parseInt(id[3])];
    }
    else if(id[2] == 'c')
    {
        return [parseInt(id[1]) , parseInt(id[3]+id[4])];
    }
    else if(id[3] == 'c' && id.length === 5)
    {
        return [parseInt(id[1]+id[2]) , parseInt(id[4])];
    }
    else
    {
        return [parseInt(id[1]+id[2]) , parseInt(id[4]+id[5])];
    }
}