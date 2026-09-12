package com.speakvaani.service;

import com.speakvaani.dto.CategoryDto;
import com.speakvaani.entity.Category;
import com.speakvaani.exception.ApiException;
import com.speakvaani.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
            .map(cat -> new CategoryDto(cat.getId(), cat.getName(), cat.getDescription()))
            .toList();
    }

    public CategoryDto getCategoryById(String id) {
        Category cat = categoryRepository.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "CATEGORY_NOT_FOUND", "Category not found: " + id));

        return new CategoryDto(cat.getId(), cat.getName(), cat.getDescription());
    }
}
