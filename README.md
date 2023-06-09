# react-hook-share-state

Share state between different components.

## API
### useShareState(key:any,initialState?:any):[state,setState]
- `key` is used to identify the shared state
- `initialState` will not work if the state exist

example :
```tsx
import {useShareState} from "react-hook-share-state";

const key = 1

function A() {
    const [count, setCount] = useShareState<number>(key,100)
    return <button onClick={() => setCount(a => a - 1)}>{count} -1</button>
}

function B() {
    const [count, setCount] = useShareState<number>(key)
    return <button onClick={() => setCount(a => a + 1)}>{count} +1</button>
}

function App() {
    return  <><B/><A/></>
}

export default App
```

### setShareState(key:any,value:any)
- assign a value to the state marked by the key

example:
```tsx
import {setShareState, useShareState} from "react-hook-share-state";

setInterval(()=>setShareState<number>('a',(a=0)=>a+1),1e3)
function App() {
    const [state]=useShareState<number>('a')
    return <h1>{state}</h1>
}

export default App
```


### getShareState(key:any):any
- get the state marked by the key

```tsx
import {setShareState, getShareState} from "react-hook-share-state";

setInterval(()=>setShareState<number>('a',(a=0)=>a+1),1e3)
function App() { 
    return <button onClick={()=>alert(getShareState('a'))}>get State</button>
}

export default App
```

### clearShareState(key:any,watch?:boolean)
- clears the state if no components use it.
- `watch`: default false. if true,the state will be auto clear when no components use it.