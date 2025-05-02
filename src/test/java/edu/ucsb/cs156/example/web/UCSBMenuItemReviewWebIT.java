// package edu.ucsb.cs156.example.web;

// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.test.annotation.DirtiesContext;
// import org.springframework.test.annotation.DirtiesContext.ClassMode;
// import org.springframework.test.context.ActiveProfiles;
// import org.springframework.test.context.junit.jupiter.SpringExtension;

// import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

// import edu.ucsb.cs156.example.WebTestCase;

// @ExtendWith(SpringExtension.class)
// @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
// @ActiveProfiles("integration")
// @DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
// public class UCSBMenuItemReviewWebIT extends WebTestCase {

//     @Test
//     public void admin_user_can_create_edit_delete_review() throws Exception {
//         setupUser(true);

//         page.getByText("UCSB Menu Item Review").click();

//         page.getByText("Create UCSBMenuItemReview").click();
//         assertThat(page.getByText("Create New UCSBMenuItemReview")).isVisible();
//         page.getByTestId("UCSBMenuItemReviewForm-itemId").fill("42");
//         page.getByTestId("UCSBMenuItemReviewForm-reviewerEmail").fill("admin@example.com");
//         page.getByTestId("UCSBMenuItemReviewForm-stars").fill("5");
//         page.getByTestId("UCSBMenuItemReviewForm-comments").fill("Amazing food!");
//         page.getByTestId("UCSBMenuItemReviewForm-submit").click();

//         assertThat(page.getByTestId("UCSBMenuItemReviewTable-cell-row-0-col-comments"))
//                 .hasText("Amazing food!");

//         page.getByTestId("UCSBMenuItemReviewTable-cell-row-0-col-Edit-button").click();
//         assertThat(page.getByText("Edit UCSBMenuItemReview")).isVisible();
//         page.getByTestId("UCSBMenuItemReviewForm-comments").fill("Truly the best.");
//         page.getByTestId("UCSBMenuItemReviewForm-submit").click();

//         assertThat(page.getByTestId("UCSBMenuItemReviewTable-cell-row-0-col-comments"))
//                 .hasText("Truly the best.");

//         page.getByTestId("UCSBMenuItemReviewTable-cell-row-0-col-Delete-button").click();

//         assertThat(page.getByTestId("UCSBMenuItemReviewTable-cell-row-0-col-itemId")).not().isVisible();
//     }

//     @Test
//     public void regular_user_cannot_create_review() throws Exception {
//         setupUser(false);

//         page.getByText("UCSB Menu Item Review").click();

//         assertThat(page.getByText("Create UCSBMenuItemReview")).not().isVisible();
//         assertThat(page.getByTestId("UCSBMenuItemReviewTable-cell-row-0-col-itemId")).not().isVisible();
//     }
// }
