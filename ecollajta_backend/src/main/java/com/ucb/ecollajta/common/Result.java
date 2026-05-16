package com.ucb.ecollajta.common;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Result<T> {

    private boolean isSuccess;
    private final T value;
    private final Map<String, List<String>> errors = new HashMap<>();

    protected Result(boolean isSuccess, T value) {
        this.isSuccess = isSuccess;
        this.value = value;
    }

    public boolean isSuccess() {
        return isSuccess;
    }

    public T getValue() {
        return value;
    }

    public boolean isFailure() {
        return !this.isSuccess;
    }

    public Map<String, List<String>> getErrors() {
        return Collections.unmodifiableMap(errors);
    }

    public static <T> Result<T> success(T value) {
        return new Result<>(true, value);
    }

    public static <T> Result<T> failure(String key, String errorMessage) {
        Result<T> result = new Result<>(false, null);
        List<String> list = new ArrayList<>();
        list.add(errorMessage);
        result.errors.put(key, list);
        return result;
    }

    public static <T> Result<T> failure(Map<String, List<String>> errors) {
        Result<T> result = new Result<>(false, null);
        if (errors != null) {
            result.errors.putAll(errors);
        }
        return result;
    }

    public void addError(String key, String errorMessage) {
        this.errors.computeIfAbsent(key, k -> new ArrayList<>()).add(errorMessage);
    }
}