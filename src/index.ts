import {useCallback, useEffect, useMemo, useState} from "react";

const store = new Map<unknown, unknown>()
const subscribers = new Map<unknown, Set<(state: unknown) => void>>()
const autoClear = new Set()
const getSubscribers = <T>(key: unknown) => {
    let s = subscribers.get(key) as Set<T>
    if (!s) {
        s = new Set();
        (subscribers as Map<unknown, Set<T>>).set(key, s)
    }
    return s
}
const syncState = <T>(key: unknown, skip?: (state: T) => void) => {
    const ss = subscribers.get(key)
    if (ss) {
        const state = store.get(key)
        for (const s of ss) {
            if (s !== skip) s(state)
        }
    }
}
export const setShareState = <T>(key: unknown, state: T | ((old: T | undefined) => T)) => {
    if (typeof state === "function") {
        const old = store.get(key) as T | undefined
        state = (state as (old: T | undefined) => T)(old)
    }
    store.set(key, state)
    syncState(key)
}
export const getShareState = (key: unknown) => {
    return store.get(key)
}

export const clearShareState = (key:unknown,watch=false)=>{
    const s = subscribers.get(key)?.size
    if(!s)store.delete(key)
    if(watch)autoClear.add(key)
}

export const useShareState = <T>(key: unknown, initialState?: T): [T | undefined, (s:T | ((s: T) => T))=>void] => {
    const [u, update] = useState(0)
    const uu = useMemo(() => [store.get(key)], [])
    const state = useMemo(() => {
        return store.get(key) as T | undefined
    }, [u])

    const changeState = useCallback((state: T) => {
        const old = uu[0] as T
        if (old !== state) {
            uu[0] = state
            store.set(key, state)
            update(Math.random())
            syncState(key, subscriber)
        }
    }, [])

    const setState = useCallback((s: T | ((a: T) => T)) => {
        const old = uu[0] as T
        let state: T
        if (typeof s === "function") {
            state = (s as (a: T) => T)(old)
        } else state = s
        changeState(state)
    }, [])

    const subscriber = useCallback((state: T) => {
        changeState(state)
    }, [])

    useEffect(() => {
        if (!store.has(key)) {
            if (initialState !== undefined) {
                store.set(key, initialState)
            }
        }
        const s = getSubscribers(key)
        s.add(subscriber)
        syncState(key)
        return () => {
            s.delete(subscriber)
            if(autoClear.has(key)&&!s.size){
                subscribers.delete(key)
                store.delete(key)
            }
        }
    }, [])

    return [state, setState]
}