/// <reference types="Cypress" />

describe('Cookie preservance before Sign-Up verification', function () {
  it('saves consent cookie from cookie banner', function () {
    cy.visit('https://www.lavazza.com.au/en_AU/coffee/capsules.html');
    cy.contains('ACCEPT ALL').click();
    Cypress.Cookies.preserveOnce('CONSENTMGR');
    cy.getCookie('CONSENTMGR').should('exist');
  });
});

describe('E2E buy product', function () {
  it('adds product to cart', function () {
    cy.visit('https://www.lavazza.com.au/en_AU/coffee/capsules.html');

    //-------------------------------------------------------
    //selecting products that are available in stock
    //and iterating over them to add each of available product to the cart
    //and to grab its variant code for later comparison

    let productsAdded = [];
    cy.get('.box.-price[stocklevelstatus="inStock"]').each((el, i) => {
      //grab product's variant code from the HTML attribute
      const productVariant = el.attr('data-var');
      //add to cart
      cy.get(el).next().click();
      cy.wait(3000);
      //grab product's variant code from the HTML attribute from the quick cart,
      //and compare with productVariant which was grabbed earlier
      cy.get('.quick-cart .product')
        .eq(i)
        .invoke('attr', 'data-product-item')
        .should('eq', productVariant);
      //push into array
      productsAdded.push(productVariant);
    });

    //-------------------------------------------------------
    //działające - dodanie wszystkich produktow w kategorii!
    // cy.get('.controls')
    //   .find('.quantity-add-plus')
    //   .should('be.visible')
    //   .click({ multiple: true });
    // cy.get('.addcart')
    //   .should('be.visible')
    //   .each((el) => {
    //     cy.get(el).click();
    //     cy.wait(2000)
    // cy.log(products)
    //     // cy.get('.quick-cart .name').pause();
    //   });

    //-------------------------------------------------------
    //addition of products' prices
    let price = 0;
    cy.get('.summary .product .price').each((el) => {
      // let productPrice = el.text().split(/(\s+)/);
      let productPrice = el.text().split('$');
      productPrice.shift();
      price = price + Number(productPrice);

      //cy.log(productPrice);
      //cy.log(price);
    });

    //and comparing it to a 'total price' displayed in a quick-cart module as well as saving
    //to a variable for later comparison

    let totalPrice = 0;
    cy.get('.total .price').then((el) => {
      let totalPriceQuickCart = el.text().split('$');
      totalPriceQuickCart.shift();
      totalPriceQuickCart = Number(totalPriceQuickCart);
      expect(totalPriceQuickCart).to.eq(price);
      totalPrice = totalPrice + totalPriceQuickCart;
    });

    //-------------------------------------------------------
    //making sure user is redirected to cart after clicking on 'go to cart' button

    cy.get('.shopping-bag')
      .should('be.visible')
      .click()
      .should('have.class', '-js-quickopen');

    cy.get('.quick-cart .cta.cta.-submit')
      .should('be.visible')
      .and('have.attr', 'onclick', "location.href='/en_AU/utils/cart.html';")
      .click();

    // cy.location('pathname').should('eq', '/en_US/utils/cart.html');

    //-------------------------------------------------------
    //verification if all the products we added earlier, are correctly listed in the cart
    //by comparing their variant codes

    let productsAddedToCart = [];
    cy.get('li[data-product-item]')
      .each((el, i) => {
        const cartProductVariant = el.attr('data-product-item');
        productsAddedToCart.push(cartProductVariant);
        //expect(cartProductVariant).to.eq(productsAdded[i]);
      })
      .then((el) => {
        expect(productsAddedToCart).to.deep.eq(productsAdded);
      });
    cy.log(productsAddedToCart);

    //-------------------------------------------------------
    //grabb product prices that are added in the cart and compare them again to sum of prices
    //counted in the quick cart

    let pricesCart = 0;
    cy.get('#cart_item_list .price')
      .each((el) => {
        let productPriceCart = el.text().split('\xa0');
        productPriceCart.shift();
        pricesCart = pricesCart + Number(productPriceCart);
      })
      .should((el) => {
        expect(pricesCart).to.eq(price);
      });

    //and comparison of subtotal displayed in the cart, to subtotal that was displayed in the quick-cart module
    cy.get('.cart-summary span.p2')
      .first()
      .then((el) => {
        let subtotalCart = el.text().split('$');
        subtotalCart.shift();
        subtotalCart = Number(subtotalCart);
        expect(subtotalCart).to.eq(totalPrice);
      });

    let productNamesCart = [];
    cy.get('.content .data .name').each((el) => {
      const product = el.text().split('\n');
      const productName = product.shift();
      console.log(productName);
      productNamesCart.push(productName);
    });

    //---------------------------------------------------------------------
    //continue as a guest, then ensure if the checkout price is coherent with the shopping cart one from previous step
    cy.get('.coupon-section__cta').click();
    cy.get('.goNoLog .cta.-half').click();
    cy.get('.-subtotal .price').then((el) => {
      let subtotalCheckout = el.text().split('$');
      subtotalCheckout.shift();
      subtotalCheckout = Number(subtotalCheckout);
      expect(subtotalCheckout).to.eq(totalPrice);
    });

    //and also compare names of products from the checkout list to the ones that were listed in the cart
    let productNamesCheckout = [];
    cy.get('.product .-c2 .name')
      .each((el, i) => {
        const productNameCheckout = el.text();
        productNamesCheckout.push(productNameCheckout);
      })
      .then((el, i) => {
        console.log(productNamesCheckout);
        console.log(productNamesCart);
        expect(productNamesCheckout).to.deep.eq(productNamesCart);
      });

    //continue as logged in user
    // cy.get('.coupon-section__cta').click();
    // cy.get('#login-form input#gigya-loginform-email', { timeout: 8000 }).type(
    //   'uk.dgt.test.block2@lavazza.com'
    // );
    // cy.get('#login-form input#gigya-loginform-password').type('Lavazza2020!');
    // cy.get('#login-form input[type="button"]').click();
    // cy.get('.coupon-section__cta').click();

    //---------------------------------------------------------------------
    //verification of checkout
    cy.get('select[name="title"]').should('not.have.attr', 'required');
  });
});
