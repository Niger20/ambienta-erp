import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAuthorizedAction, AuthorizationModal } from '../../components/auth';
import { IconBarcode, IconBox, IconTag, IconHistory, IconMerma, IconFilePdf, IconDownload, IconUpload, IconPlus, IconRefresh } from './icons';
import { useProductsData } from './useProductsData';
import { useProductCrud } from './useProductCrud';
import { useCategoryCrud } from './useCategoryCrud';
import { useProductsFilters } from './useProductsFilters';
import { useCategoriesFilters } from './useCategoriesFilters';
import { useMovimientos } from './useMovimientos';
import { useMermas } from './useMermas';
import { useBarcodesTab } from './useBarcodesTab';
import { useExcelImport } from './useExcelImport';
import { useInventoryReports } from './useInventoryReports';
import { ProductsTab } from './ProductsTab';
import { CategoriesTab } from './CategoriesTab';
import { MovimientosTab } from './MovimientosTab';
import { MermasTab } from './MermasTab';
import { BarcodesTab } from './BarcodesTab';
import { ProductModal } from './ProductModal';
import { CategoryModal } from './CategoryModal';
import { AjusteModal } from './AjusteModal';
import { MermaModal } from './MermaModal';
import { CatAssignModal } from './CatAssignModal';

const Products = () => {
    const { user } = useAuth();
    const { requestAuth, authModalProps } = useAuthorizedAction();
    const [activeTab, setActiveTab] = useState('products');

    const { products, categories, unidadesMedida, isLoading, error, fetchData } = useProductsData();

    // Estado de productForm se declara primero porque tanto el CRUD de producto
    // como el de categoría necesitan referenciarlo (categoría se crea "en línea"
    // desde el modal de producto).
    const productCrud = useProductCrud(categories, unidadesMedida, fetchData, requestAuth, () => openCreateCategoryModal());

    const {
        isProductModalOpen, setIsProductModalOpen,
        isEditingProduct,
        productForm, setProductForm,
        openCreateProductModal, editProduct, deleteProduct,
        handleProductInputChange, handleBarcodeKeyDown, handleCreateProduct,
    } = productCrud;

    const {
        isCategoryModalOpen, setIsCategoryModalOpen,
        isEditingCategory,
        categoryForm, setCategoryForm,
        openCreateCategoryModal, editCategory, deleteCategory, handleCreateCategory,
    } = useCategoryCrud(fetchData, requestAuth, (categoryId: string) => {
        setProductForm(prev => ({ ...prev, categoriaid: categoryId }));
    });

    const {
        productSearchQuery, setProductSearchQuery,
        productCategoryFilter, setProductCategoryFilter,
        productSortBy, productSortOrder, handleProductSort,
        filteredProducts, productPage, setProductPage, totalProductPages, paginatedProducts,
    } = useProductsFilters(products);

    const {
        categorySearchQuery, setCategorySearchQuery,
        categorySortBy, categorySortOrder, handleCategorySort, filteredCategories,
    } = useCategoriesFilters(categories);

    const movimientos = useMovimientos(products, fetchData, requestAuth);
    const mermas = useMermas(products, user?.id, fetchData, requestAuth);
    const barcodes = useBarcodesTab(products);
    const excelImport = useExcelImport(categories, fetchData);
    const { exportInventarioPDF, handleRecalculateStockMinimo } = useInventoryReports(products, user?.nombreusuario, fetchData, requestAuth);

    return (
        <>
            <div className="page-container">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, border: 'none', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Manejo de Inventario</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Organizar productos y categorías.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {excelImport.importProgress && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
                                Importando... {excelImport.importProgress.done}/{excelImport.importProgress.total}
                            </span>
                        )}
                        {activeTab === 'products' && (
                            <button
                                className="btn"
                                onClick={exportInventarioPDF}
                                title="Exportar inventario completo en PDF"
                                style={{
                                    backgroundColor: 'var(--accent-primary-bg)',
                                    color: 'var(--accent-primary)',
                                    border: '1px solid var(--accent-primary)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 600
                                }}
                            >
                                <IconFilePdf />
                                <span>Exportar PDF</span>
                            </button>
                        )}
                        {activeTab === 'products' && (
                            <button
                                className="btn"
                                onClick={handleRecalculateStockMinimo}
                                title="Recalcular stock mínimo de todos los productos basándose en el historial de ventas"
                                style={{
                                    backgroundColor: 'var(--accent-primary-bg)',
                                    color: 'var(--accent-primary)',
                                    border: '1px solid var(--accent-primary)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 600
                                }}
                            >
                                <IconRefresh />
                                <span>Stock Mínimo Automático</span>
                            </button>
                        )}
                        <button
                            className="btn"
                            onClick={excelImport.downloadProductTemplate}
                            title="Descargar plantilla Excel"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                fontWeight: 500
                            }}
                        >
                            <IconDownload />
                            <span>Plantilla Excel</span>
                        </button>
                        <button
                            className="btn"
                            onClick={() => excelImport.excelInputRef.current?.click()}
                            title="Importar Excel"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                fontWeight: 500
                            }}
                        >
                            <IconUpload />
                            <span>Importar Excel</span>
                        </button>
                        <input ref={excelImport.excelInputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={excelImport.handleProductExcelUpload} />
                        <button
                            className="btn btn-primary"
                            onClick={openCreateProductModal}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 600
                            }}
                        >
                            <IconPlus />
                            <span>Nuevo Producto</span>
                        </button>
                    </div>
                </div>

                {/* Menu Tabs */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    {[
                        { tab: 'products', label: 'Productos', icon: IconBox },
                        { tab: 'categories', label: 'Categorías', icon: IconTag },
                        { tab: 'movimientos', label: 'Movimientos', icon: IconHistory },
                        { tab: 'mermas', label: 'Mermas / Quiebres', icon: IconMerma },
                        { tab: 'barcodes', label: 'Códigos de Barra', icon: IconBarcode }
                    ].map(item => {
                        const TabIcon = item.icon;
                        const isActive = activeTab === item.tab;
                        return (
                            <button
                                key={item.tab}
                                className={`btn ${isActive ? 'btn-primary' : ''}`}
                                onClick={() => {
                                    setActiveTab(item.tab);
                                    if (item.tab === 'movimientos') movimientos.fetchMovimientos();
                                    if (item.tab === 'mermas') mermas.fetchMermas();
                                }}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    fontSize: '0.85rem',
                                    whiteSpace: 'nowrap',
                                    backgroundColor: !isActive ? 'var(--bg-card)' : '',
                                    color: !isActive ? 'var(--text-primary)' : '',
                                    border: !isActive ? '1px solid var(--border-color)' : '1px solid var(--accent-primary)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 600,
                                    transition: 'all 0.2s var(--ease-out)'
                                }}
                            >
                                <TabIcon />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="card">
                    {activeTab === 'barcodes' ? (
                        <BarcodesTab
                            includeNameInPdf={barcodes.includeNameInPdf}
                            setIncludeNameInPdf={barcodes.setIncludeNameInPdf}
                            includePriceInPdf={barcodes.includePriceInPdf}
                            setIncludePriceInPdf={barcodes.setIncludePriceInPdf}
                            generateBulkPDF={barcodes.generateBulkPDF}
                            selectedBarcodes={barcodes.selectedBarcodes}
                            setSelectedBarcodes={barcodes.setSelectedBarcodes}
                            barcodeSearch={barcodes.barcodeSearch}
                            setBarcodeSearch={barcodes.setBarcodeSearch}
                            barcodeCategoryFilter={barcodes.barcodeCategoryFilter}
                            setBarcodeCategoryFilter={barcodes.setBarcodeCategoryFilter}
                            categories={categories}
                            products={products}
                            filteredBarcodeProducts={barcodes.filteredBarcodeProducts}
                            selectAllVisible={barcodes.selectAllVisible}
                            deselectAll={barcodes.deselectAll}
                            toggleSelectAll={barcodes.toggleSelectAll}
                            printSingleLabel={barcodes.printSingleLabel}
                            labelPresetId={barcodes.labelPresetId}
                            setLabelPresetId={barcodes.setLabelPresetId}
                            customLabelConfig={barcodes.customLabelConfig}
                            updateCustomLabelConfig={barcodes.updateCustomLabelConfig}
                            activeLabelConfig={barcodes.activeLabelConfig}
                            labelGridLayout={barcodes.labelGridLayout}
                        />
                    ) : activeTab === 'products' ? (
                        <ProductsTab
                            productSearchQuery={productSearchQuery}
                            setProductSearchQuery={setProductSearchQuery}
                            productCategoryFilter={productCategoryFilter}
                            setProductCategoryFilter={setProductCategoryFilter}
                            categories={categories}
                            isLoading={isLoading}
                            error={error}
                            productSortBy={productSortBy}
                            productSortOrder={productSortOrder}
                            handleProductSort={handleProductSort}
                            paginatedProducts={paginatedProducts}
                            filteredProducts={filteredProducts}
                            productPage={productPage}
                            setProductPage={setProductPage}
                            totalProductPages={totalProductPages}
                            onEditProduct={editProduct}
                            onDeleteProduct={deleteProduct}
                        />
                    ) : activeTab === 'categories' ? (
                        <CategoriesTab
                            categorySearchQuery={categorySearchQuery}
                            setCategorySearchQuery={setCategorySearchQuery}
                            onCreateCategory={openCreateCategoryModal}
                            isLoading={isLoading}
                            error={error}
                            categorySortBy={categorySortBy}
                            categorySortOrder={categorySortOrder}
                            handleCategorySort={handleCategorySort}
                            filteredCategories={filteredCategories}
                            onEditCategory={editCategory}
                            onDeleteCategory={deleteCategory}
                        />
                    ) : activeTab === 'movimientos' ? (
                        <MovimientosTab
                            movSearch={movimientos.movSearch}
                            setMovSearch={movimientos.setMovSearch}
                            onOpenAjusteModal={movimientos.openAjusteModal}
                            movLoading={movimientos.movLoading}
                            filteredGroups={movimientos.filteredGroups}
                            totalMovGroupsPages={movimientos.totalMovGroupsPages}
                            paginatedGroups={movimientos.paginatedGroups}
                            movPage={movimientos.movPage}
                            setMovPage={movimientos.setMovPage}
                            expandedProductId={movimientos.expandedProductId}
                            setExpandedProductId={movimientos.setExpandedProductId}
                            exportMovimientosPDF={movimientos.exportMovimientosPDF}
                            movimientosPages={movimientos.movimientosPages}
                            setMovimientosPages={movimientos.setMovimientosPages}
                        />
                    ) : activeTab === 'mermas' ? (
                        <MermasTab
                            mermaSearch={mermas.mermaSearch}
                            setMermaSearch={mermas.setMermaSearch}
                            onOpenMermaModal={mermas.openMermaModal}
                            mermasLoading={mermas.mermasLoading}
                            filteredMermas={mermas.filteredMermas}
                            paginatedMermas={mermas.paginatedMermas}
                            mermaPage={mermas.mermaPage}
                            setMermaPage={mermas.setMermaPage}
                            totalMermaPages={mermas.totalMermaPages}
                            onDeleteMerma={mermas.handleDeleteMerma}
                        />
                    ) : null}
                </div>

                <MermaModal
                    show={mermas.showMermaModal}
                    form={mermas.mermaForm}
                    setForm={mermas.setMermaForm}
                    onSubmit={mermas.handleCreateMerma}
                    onClose={() => mermas.setShowMermaModal(false)}
                    products={products}
                    productSearch={mermas.mermaProductSearch}
                    setProductSearch={mermas.setMermaProductSearch}
                    showProductDropdown={mermas.showMermaProductDropdown}
                    setShowProductDropdown={mermas.setShowMermaProductDropdown}
                    destinoSearch={mermas.mermaDestinoSearch}
                    setDestinoSearch={mermas.setMermaDestinoSearch}
                    showDestinoDropdown={mermas.showMermaDestinoDropdown}
                    setShowDestinoDropdown={mermas.setShowMermaDestinoDropdown}
                />

                <ProductModal
                    show={isProductModalOpen}
                    isEditing={isEditingProduct}
                    form={productForm}
                    setForm={setProductForm}
                    onInputChange={handleProductInputChange}
                    onBarcodeKeyDown={handleBarcodeKeyDown}
                    onSubmit={handleCreateProduct}
                    onClose={() => setIsProductModalOpen(false)}
                    categories={categories}
                    unidadesMedida={unidadesMedida}
                />

                <CategoryModal
                    show={isCategoryModalOpen}
                    isEditing={isEditingCategory}
                    form={categoryForm}
                    onChange={setCategoryForm}
                    onSubmit={handleCreateCategory}
                    onCancel={() => {
                        setIsCategoryModalOpen(false);
                        if (!isEditingCategory) {
                            setProductForm(prev => ({ ...prev, categoriaid: '' }));
                        }
                    }}
                />

                <AjusteModal
                    show={movimientos.showAjusteModal}
                    form={movimientos.ajusteForm}
                    setForm={movimientos.setAjusteForm}
                    onSubmit={movimientos.handleCreateAjuste}
                    onClose={() => movimientos.setShowAjusteModal(false)}
                    products={products}
                    productSearch={movimientos.ajusteProductSearch}
                    setProductSearch={movimientos.setAjusteProductSearch}
                    showProductDropdown={movimientos.showAjusteProductDropdown}
                    setShowProductDropdown={movimientos.setShowAjusteProductDropdown}
                />
            </div>

            <CatAssignModal
                show={excelImport.showCatAssign}
                pendingProducts={excelImport.pendingProducts}
                catAssignMap={excelImport.catAssignMap}
                setCatAssignMap={excelImport.setCatAssignMap}
                categories={categories}
                onCancel={() => { excelImport.setShowCatAssign(false); }}
                onConfirm={excelImport.handleConfirmCatAssign}
            />

            <AuthorizationModal {...authModalProps} />
        </>
    );
};

export default Products;
