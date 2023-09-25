import pytest


def pytest_addoption(parser):
    parser.addoption(
        "--noapi", action="store_false", default=True, help="don't run UCSB api tests"
    )


def pytest_configure(config):
    config.addinivalue_line("markers", "noapi: mark test depending on UCSB api key")


def pytest_collection_modifyitems(config, items):
    if config.getoption("--noapi"):
        # --noapi given in cli: skip tests depending on api key
        return
    skip_api = pytest.mark.skip(reason="need --noapi option off to run")
    for item in items:
        if "noapi" in item.keywords:
            item.add_marker(skip_api)
