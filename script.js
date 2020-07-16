//Get grid div, set-start button, and set-end button
let grid = document.getElementById("grid")
let start = document.getElementById("set-start")
let end = document.getElementById("set-end")
let find_path = document.getElementById("find-path")
let start_pos = [0,0]
let end_pos  = [19,19]
let dragon_pos_list=[]

//Variables for path finding functions 
let R = 20
let C = 20
let rq = []
let cq = []
let rs = start_pos[0]
let cs = start_pos[1]

//Array to track visited block
let visited = new Array(20)
for(let i=0 ;i<20; i++)
{
    visited[i] = new Array(20)
}

//Array to get previous block in a path
let prev = new Array(20)
for(let i=0 ;i<20; i++)
{
    prev[i] = new Array(20)
}

//Initialize previous array with false
for(let i = 0; i<20; i++)
{
    for(let j = 0; j<20; j++)
    prev[i][j] = false
}

//Initialize visited array with false
for(let i = 0; i<20; i++)
{
    for(let j = 0; j<20; j++)
    visited[i][j] = false
}

//The final board after adding a dragon, moving a princess and the knight
let final_board = new Array(20)
for(let i=0 ;i<final_board.length; i++)
{
    final_board[i] = new Array(20)
}

// 0 for adding dragon 1 for changing knight position 2 for changinng princess position
let state = 0

//Set the board
updateBoard()

//Adding event listener to knight
start.addEventListener('click',()=>{
    end.classList.remove('selected')
    start.classList.add('selected')
    state = 1
});

//Adding event listener to princess
end.addEventListener('click',()=>{
    start.classList.remove('selected')
    end.classList.add('selected')
    state = 2
});

//Adding event listener to find-path button
find_path.addEventListener('click',()=>{
   
    //Adding position of a dragon as an obstacle(denoted by #) to the final_board
    for(let obs of dragon_pos_list)
    {
        final_board[obs[0]][obs[1]] = '#'
    }

    //Adding start-position(denoted by S) and end-position(denoted by E) to the final_board
    final_board[start_pos[0]][start_pos[1]] = 'S'
    final_board[end_pos[0]][end_pos[1]] = 'E'
    
    //path finding algo
    rs = start_pos[0]
    cs = start_pos[1]
    prev[start_pos[0]][start_pos[1]] = [-1,-1]
    solver()
    cr = [...end_pos]
    while(cr[0] >= 0 || cr[1] >= 0)
    {    
        let crid = 'r'+cr[0]+'c'+cr[1]
        document.getElementById(crid).classList.add('path')
        cr = prev[cr[0]][cr[1]]
    }
})


function updateBoard()
{   

    let noRows = 20
    let noCols = 20
    let bheight = Math.floor(1000/noRows)
    let bwidth = Math.floor(1000/noCols)
    
    for(let r = 0 ; r<noRows ; r++)
    {
        let nthRow = document.createElement("div")
        nthRow.className = "nth-row"
        nthRow.id = "r"+r
        nthRow.style.height = bheight+"px"
        nthRow.style.width = 1000+"px"
        grid.appendChild(nthRow)
        
        for(let c = 0 ; c < noCols ; c++)
        {
            let block = document.createElement('div')
            block.id = "r"+r+"c"+c
            block.className = "grid-block"
            block.style.height = bheight+"px"
            block.style.width = bwidth+"px"
            
            if(r===0 && c===0)
                block.classList.add('start-block')
            
            if(r===19 && c===19)
            {
                block.classList.add('end-block')
            }
//Adding event listener to each block
//The event listener work differently according to the state, which is being set by the set-start and set-end button
            block.addEventListener('click',()=>{
                let [r,c] = extractIndex(block.id)
                let index = getIndexofArray(dragon_pos_list,[r,c])
                if(state === 0)
                {   
                    if(start_pos[0] != r || start_pos[1] != c)
                    {   
                        block.classList.toggle('dragon')

                        if(index >= 0)
                        {
                            dragon_pos_list.splice(index,1)    
                        }
                        else
                        {
                            dragon_pos_list = dragon_pos_list.concat([[r, c]])
                        }
                    }
                }
                else if(state === 1)
                {
                    if(end_pos[0] != r || end_pos[1] != c)
                    {    
                        let prev_start = "r"+start_pos[0]+"c"+start_pos[1]
                        block.classList.remove('dragon')
                        document.getElementById(prev_start).classList.remove('start-block')
                        start_pos[0] = r
                        start_pos[1] = c
                        block.classList.add('start-block')
                        state = 0
                        start.classList.remove('selected')
                        
                        if(index >= 0)
                        {
                            console.log(r,c,"removed")
                            dragon_pos_list.splice(index,1)    
                        }
                        else
                        {
                            console.log(r,c,"added")
                            dragon_pos_list = dragon_pos_list.concat([[r, c]])
                        }
                    }
                }
                else
                {
                    if(start_pos[0] != r || start_pos[1] != c)
                    {    
                        let prev_end = "r"+end_pos[0]+"c"+end_pos[1]
                        block.classList.remove('dragon')
                        document.getElementById(prev_end).classList.remove('end-block')
                        end_pos[0] = r
                        end_pos[1] = c
                        block.classList.add('end-block')
                        state = 0
                        end.classList.remove('selected')
                        
                        if(index >= 0)
                        {
                            console.log(r,c,"removed")
                            dragon_pos_list.splice(index,1)    
                        }
                        else
                        {
                            console.log(r,c,"added")
                            dragon_pos_list = dragon_pos_list.concat([[r, c]])
                        }
                    }

                }   
            })    
            
            nthRow.appendChild(block)
        }
    } 
}

//This function is used to get the index of the array(item) stored in another array
//As we can't directly compare two different array 
function getIndexofArray(array, item)
{
    for (var i = 0; i < array.length; i++)
    {
        if (array[i][0] == item[0] && array[i][1] == item[1])
        {
            return i   // Found it
        }
    }
    return -1   // Not found
}

//This function is used to change the id(string) to the position [r,c]
//Ex r1c2 -> [1,2]
//r10c2 -> [10,2]
function extractIndex(id)
{
    if(id.length === 4)
    {
        return [parseInt(id[1]) , parseInt(id[3])]
    }
    else if(id[2] == 'c')
    {
        return [parseInt(id[1]) , parseInt(id[3]+id[4])]
    }
    else if(id[3] == 'c' && id.length === 5)
    {
        return [parseInt(id[1]+id[2]) , parseInt(id[4])]
    }
    else
    {
        return [parseInt(id[1]+id[2]) , parseInt(id[4]+id[5])]
    }
}




//This function is used to solve the final_board filled with princess, knight and dragons
function solver()
{    
    let current_steps = 1
    let next_steps = 0
    let end = false
    let move = 0
    visited[start_pos[0]][start_pos[1]]=true
    rq = rq.concat(rs)
    cq = cq.concat(cs)
    while(rq)
    {    
        let r = rq.shift()
        let c = cq.shift()
        if(final_board[r][c] == 'E')
        {    
            end = true
            break
        }
        current_steps -= 1
        next_steps += reach_neighbour(r,c)
        if(current_steps == 0)
        {    
            current_steps = next_steps
            next_steps = 0
            move += 1
        }
    }
    if(end)
        return move
    else
        return -1

    }



// This function is used to get the neighbour of a position and add neighbour's row to rq[]
// and column to cq[] and set visited[neighbour] = true 
function reach_neighbour(r,c)
{  
    let steps=0
    let ra = [-1,1,0,0]
    let ca = [0,0,-1,1]
    for(let i = 0; i<4; i++)
    {    
        rr = ra[i]+r
        cc = ca[i]+c
        if(rr<0 || cc<0)
            continue
        if(rr>= R || cc >= C)
            continue
        if(visited[rr][cc])
            continue
        if(final_board[rr][cc] == '#')
            continue
        
        rq = rq.concat(rr)
        cq = cq.concat(cc)
        visited[rr][cc] = true
        steps += 1
        prev[rr][cc] = [r,c]
    }
    return steps
}


