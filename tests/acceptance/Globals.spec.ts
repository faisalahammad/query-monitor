import { test, expect } from './utils/test-setup';

test.describe( 'Global Variables', () => {
	test.beforeAll( async ( { globalUtils } ) => {
		globalUtils.installWordPress();
	} );

	test.beforeEach( async ( { QueryMonitor } ) => {
		await QueryMonitor.loginViaPage( 'admin', 'password' );
	} );

	for ( const url of [ '/', '/wp-admin/' ] ) {
		test( `sprintf and vsprintf are not exposed as globals on ${url}`, async ( { page } ) => {
			await page.goto( url );
			await page.locator( '#wp-admin-bar-query-monitor' ).click();
			await expect( page.locator( '#query-monitor-main' ) ).toBeVisible();

			const globals = await page.evaluate( () => ( {
				sprintf: typeof ( window as any ).sprintf,
				vsprintf: typeof ( window as any ).vsprintf,
			} ) );

			expect( globals ).toEqual( {
				sprintf: 'undefined',
				vsprintf: 'undefined',
			} );
		} );
	}
} );
