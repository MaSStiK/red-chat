"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";

export function useDebounceAsync(fn, delay = 500) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const abortRef = useRef(null);
    const fnRef = useRef(fn);

    // Всегда храним актуальную версию функции
    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    // debounce создается только по delay
    const debouncedFn = useMemo(() => {
        return debounce(async (...args) => {
            try {
                if (abortRef.current) {
                    abortRef.current.abort();
                }

                const controller = new AbortController();
                abortRef.current = controller;

                setLoading(true);
                setError("");

                await fnRef.current(...args, controller.signal);
            } catch (error) {
                if (error.name !== "AbortError") {
                    setError(error.message || "Ошибка");
                }
            } finally {
                setLoading(false);
            }
        }, delay);
    }, [delay]);

    useEffect(() => {
        return () => {
            debouncedFn.cancel();

            if (abortRef.current) {
                abortRef.current.abort();
            }
        };
    }, [debouncedFn]);

    return {
        run: debouncedFn,
        loading,
        error,
        setError,
    };
}