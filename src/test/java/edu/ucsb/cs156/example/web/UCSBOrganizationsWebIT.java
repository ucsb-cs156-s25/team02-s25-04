package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationsWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_ucsborganization() throws Exception {
        setupUser(true);

        page.getByText("UCSB Organizations").click();

        page.getByText("Create UCSB Organization").click();
        assertThat(page.getByText("Create New UCSB Organization")).isVisible();
        page.getByTestId("UCSBOrganizationForm-orgCode").fill("aleph");
        page.getByTestId("UCSBOrganizationForm-orgTranslationShort").fill("A");
        page.getByTestId("UCSBOrganizationForm-orgTranslation").fill("A");
        page.getByLabel("Inactive").click();

        page.getByTestId("UCSBOrganizationForm-submit").click();

        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode"))
                .hasText("aleph");

        // page.getByTestId("RestaurantTable-cell-row-0-col-Edit-button").click();
        // assertThat(page.getByText("Edit Restaurant")).isVisible();
        // page.getByTestId("UCSBOrganizationForm-description").fill("THE BEST");
        // page.getByTestId("UCSBOrganizationForm-submit").click();

        // assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-description")).hasText("THE BEST");

        // page.getByTestId("RestaurantTable-cell-row-0-col-Delete-button").click();

        // assertThat(page.getByTestId("RestaurantTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_ucsborganization() throws Exception {
        setupUser(false);

        page.getByText("UCSB Organizations").click();

        assertThat(page.getByText("Create UCSB Organization")).not().isVisible();
       // assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-name")).not().isVisible();
    }
}