<?php
/**
 * Plugin Name: Mầm — Thanh Ấn FAQ (Review Prototype)
 * Description: Local deterministic FAQ and published-price assistant. Disabled by default; enable only after review in staging.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 */
if (!defined('ABSPATH')) { exit; }

function ta_mam_chat_enqueue_assets() {
    // Activation alone never displays the widget. A reviewed explicit filter must enable it.
    if (is_admin() || !apply_filters('ta_mam_chat_enabled', false)) { return; }

    // An incomplete local package must not leave a partly loaded widget on the page.
    $asset_path = plugin_dir_path(__FILE__) . 'assets/';
    $scripts = array(
        'ta-mam-policy' => array('policy.js', array()),
        'ta-mam-mascot' => array('mascot.js', array()),
        'ta-mam-price-menu' => array('price-menu.js', array('ta-mam-policy')),
        'ta-mam-widget' => array('widget.js', array('ta-mam-policy', 'ta-mam-mascot', 'ta-mam-price-menu')),
        'ta-mam-bootstrap' => array('bootstrap.js', array('ta-mam-widget')),
    );
    $required_files = array('policy.js', 'mascot.js', 'price-menu.js', 'widget.js', 'bootstrap.js', 'widget.css', 'data.json', 'seedy-spritesheet-v10.webp');
    $bundle_modified = 0;
    foreach ($required_files as $file) {
        if (!is_file($asset_path . $file) || !is_readable($asset_path . $file)) { return; }
        $modified = filemtime($asset_path . $file);
        if (false !== $modified) { $bundle_modified = max($bundle_modified, $modified); }
    }

    $base = plugin_dir_url(__FILE__) . 'assets/';
    foreach ($scripts as $handle => $asset) {
        // WordPress keeps the dependency order; the boolean footer argument also supports WP 6.0.
        $version = $bundle_modified ? (string) $bundle_modified : '1.0.0';
        wp_enqueue_script($handle, $base . $asset[0], $asset[1], $version, true);
    }
}
add_action('wp_enqueue_scripts', 'ta_mam_chat_enqueue_assets');
