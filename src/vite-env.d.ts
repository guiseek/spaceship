/// <reference types="vite/client" />

interface Callback<T> {
	(value: T): void
}