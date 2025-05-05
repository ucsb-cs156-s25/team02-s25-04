package edu.ucsb.cs156.example.web;

import org.checkerframework.checker.units.qual.t;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import java.time.LocalDateTime;

import edu.ucsb.cs156.example.WebTestCase;
import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class ArticleWebIT extends WebTestCase {
    @Autowired
    ArticlesRepository articlesRepository;
    @Test
    public void admin_user_can_create_edit_delete_articles() throws Exception {
        
        LocalDateTime ldt1 = LocalDateTime.parse("2022-04-20T00:00:00");

        Articles article1 = Articles.builder()
                .title("Using testing-playground with React Testing Library")
                .url("https://dev.to/katieraby/using-testing-playground-with-react-testing-library-26j7")
                .explanation("Helpful when we get to front end development")
                .email("phtcon@ucsb.edu")
                .dateAdded(ldt1)
                .build();

        articlesRepository.save(article1);

        setupUser(true);

        page.getByText("Articles").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).hasText("Using testing-playground with React Testing Library");

        page.getByTestId("ArticlesTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("ArticlesTable-cell-row-0-col-title")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_article() throws Exception {
        setupUser(false);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Articles")).not().isVisible();
    }

    @Test
    public void admin_user_can_see_create_article_button() throws Exception {
        setupUser(true);

        page.getByText("Articles").click();

        assertThat(page.getByText("Create Articles")).isVisible();
    }
}